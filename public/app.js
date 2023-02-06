const APICtrl = (function(){
    const news = new News;
    const coinCap = new CoinMarket;

    return{
        getNewsData: ()=>{
            news.getNews(1)
               .then(data => UICtrl.showNews(data))
                .catch(err => console.log(err));
        },
        getCoins:(limit)=>{
            coinCap.getCoins(limit)
                .then(data => {
                    UICtrl.showCoins(data);
                })
                 .catch(err => console.log(err))
        },
        getFiats:(limit)=>{
            coinCap.getFiats(limit)
                .then(data => {
                    UICtrl.showFiats(data);
                })
                 .catch(err => console.log(err))
        },
        getConvertionRate:(from,to)=>{
            coinCap.getConvertion(from,to,1)
                .then(data => {    
                   UICtrl.showConvertedRate(data);
                //    console.log(data);
                })
                 .catch(() => alert('This Conversion is not possible. We are so sorry for this inconvenience.'))
        },
        getFinalConvertion: (from,to,amt)=>{
            coinCap.getConvertion(from,to,amt)
                .then(data => {    
                   UICtrl.showConvertedCurrency(data);
                   console.log(data);
                })
                 .catch(()=>alert('This Conversion is not possible. We are so sorry for the inconvenience.'))
        },
        getRankersList: (sort,limit)=>{
            coinCap.getListings(sort,limit)
                .then(data => {    
                   UICtrl.showRankersList(data);
                })
                 .catch(err => console.log(err))
        },
        getGainersList: (sort,limit)=>{
            coinCap.getListings(sort,limit)
                .then(data => {    
                   UICtrl.showGainersList(data);
                })
                 .catch(err => console.log(err))
        },
        getNewbieList: (sort,limit)=>{
            coinCap.getListings(sort,limit)
                .then(data => {    
                   UICtrl.showNewbieList(data);
                })
                 .catch(err => console.log(err))
        }
    }
})();





const UICtrl = (function(APICtrl){
    // Selectors
    const UISelectors = {  
        menuToggler: '.navbar-toggler',
        mainMenu:'.main-menu',
        newsList:'.row-flex',
        convert:'#convertCurr',
        rankersList:'#rankers-list',
        gainersList:'#gainers-list',
        newbieList:'#newbie-list',
        convertionRate:'#convertionRate',
        quantity:'#quantity',
        result:'#result',
        formSelect:'form-select',
        fromSelect:'#fromSelect',
        toSelect:'#toSelect',
        topConversions:'#topConversion',
        swap:'#swap',
        next:"#next",
        prev:"#prev",
        converter:'#converter',
        converterHead:'#converter-head',

    }
    function priceWithCommas(x) {
        x = x.toString();
        arr = x.split('.');
        var pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(arr[0]))
            arr[0] = arr[0].replace(pattern, "$1,$2");
        return arr[0]+'.'+arr[1];
    }

    return{
        getUISelectors:()=>{
            return UISelectors;
        },
        showNews:(data)=>{
            let output='';
            for(let i=0;i<2;i++){
                output+=`<div class="column">`;
                for(let j=i*3;j<i*3+3;j++){
                    output +=  `
                        <div class="block">
                            <img src="${data.articles[j].media}" class="box" style="width:100%">
                            <div class="info-news box p-3">
                                <h2 class="news-item-head"><a href="${data.articles[j].link}" class="news-item-head">${data.articles[j].title}</a></h2>
                                <p class="news-summary mt-3">${(data.articles[j].summary)}</p>
                                <a href="${data.articles[j].link}" class="btn btn-dark">Read More</a>
                            </div>
                        </div>
                        `
                }
                output+=`</div>`   
            };
            document.querySelector(UISelectors.newsList).innerHTML=output;
        },
        showCoins:(ranking)=>{
            const fromSelect = document.querySelector(UISelectors.fromSelect);
            const toSelect = document.querySelector(UISelectors.toSelect);
            let upperSelect='';
            for(let i =0;i<ranking.length;i++){
                    upperSelect+=`
                        <option id="${ranking[i].symbol}">${ranking[i].symbol} - ${ranking[i].name}</option>
                    `;
            };
            let lowerSelect = '';
            for(let i =0;i<ranking.length;i++){
                lowerSelect+=`
                    <option id="${ranking[i].symbol}">${ranking[i].symbol} - ${ranking[i].name}</option>
                `
            };
            fromSelect.innerHTML+=upperSelect;
            toSelect.innerHTML+=lowerSelect;

            for(let i =0;i<fromSelect.options.length;i++){
                if(fromSelect.options[i].id === 'BTC'){
                    fromSelect.options[i].selected = true;
                }

            }

            for(let i =0;i<toSelect.options.length;i++){
                if(toSelect.options[i].id === 'INR'){
                    toSelect.options[i].selected = true;
                    console.log(toSelect.options[i].textContent);
                    break;
                }
            }

            // Get Rates
            let fromID = fromSelect.options[fromSelect.selectedIndex].id;
            let toID = toSelect.options[toSelect.selectedIndex].id;
            try {
                APICtrl.getConvertionRate(fromID,toID);
            } catch (error) {
                alert("This conversion is not possible, we are so sorry for this inconvenience")
            }
        },
        showFiats:(ranking)=>{
            const fromSelect=document.querySelector(UISelectors.fromSelect);
            const toSelect=document.querySelector(UISelectors.toSelect);
            let output='';
            for(let i =0;i<ranking.length;i++){
                output += `<option id="${ranking[i].symbol}">${ranking[i].symbol} - ${ranking[i].name}</option>`;
            };
            
            output+='<option disabled="disabled" class = "py-2">Crypto Coins</option>';

            fromSelect.innerHTML=output;
            toSelect.innerHTML=output;

            
            // console.log('INR');

        },
        showConvertedRate:(data)=>{
            const fromField = document.querySelector(UISelectors.fromSelect)
            const fromName= fromField.options[fromField.selectedIndex].textContent;
            const fromNameArr = fromName.split(' -');

            const toField = document.querySelector(UISelectors.toSelect);
            const toName = toField.options[toField.selectedIndex].textContent;
            const toNameArr = toName.split(' -');

            let toID = toField.options[toSelect.selectedIndex].id;
            let output = `
                ${fromNameArr[0]}/${toNameArr[0]}: <span style="font-weight:800">${priceWithCommas((data[0].quote[toID].price).toFixed(7))}</span>
            `;
            document.querySelector(UISelectors.convertionRate).innerHTML=output;
        },
        showConvertedCurrency:(data)=>{
            const fromField = document.querySelector(UISelectors.fromSelect)
            const fromName= fromField.options[fromField.selectedIndex].textContent;
            const fromNameArr = fromName.split(' -');

            const toField = document.querySelector(UISelectors.toSelect);
            const toName = toField.options[toField.selectedIndex].textContent;
            const toNameArr = toName.split(' -');
            const toID = toField.options[toSelect.selectedIndex].id;
            let output = `
                <div class="card-body">
                    <h4 class="card-title text-center">${data[0].amount} ${fromNameArr[0]} = ${priceWithCommas((data[0].quote[toID].price).toFixed(5))} ${toNameArr[0]}</h4>
                </div>
            `;
            // console.log(output);
            document.querySelector(UISelectors.result).innerHTML=output;
        },
        showTopConversions:()=>{
            const coinCap = new CoinMarket();

            coinCap.getCoins(4).then(coins => {
                coinCap.getFiats(3).then(fiats => getRates(coins,fiats));
            })

    //         coinCap.getCoins(520).then(coins => {
    //             coinCap.getFiats(60).then(fiats => {
    //                 printSitemap(coins,fiats);
    //             });
    //         })

    //         function printSitemap(coins,fiats){
    //             for(let k=0.125;k<4;k=k*2){
    //                 let sitemap='';
    //                 for(let i=21;i<coins.length;i++){
    //                     for(let j=0;j<fiats.length;j++){
    //                             sitemap+=`
    // <url>
    //     <loc>https://coinmasters.in/converter/${(coins[i].symbol).toLowerCase()}/${(fiats[j].symbol).toLowerCase()}/${k}</loc>
    //     <lastmod>2022-07-29T11:14:22+00:00</lastmod>
    //     <priority>0.80</priority>
    // </url>
    //                             `;
    //                         }
    //                     }
    //                     console.log(sitemap);

    //                 }
    //         }


            function getRates(coins,fiats){
                    document.querySelector('#topConversion').innerHTML='';

                for(let i=0;i<coins.length;i++){
                    for(let j=0;j<fiats.length;j++){
                        coinCap.getConvertion(coins[i].symbol,fiats[j].symbol,1).then(data => createHTML(data[0].quote[fiats[j].symbol].price));
                        function createHTML(price){       
                            let output='';
                            output=`
                                <a href="/converter/${(coins[i].symbol).toLowerCase()}/${(fiats[j].symbol).toLowerCase()}" style="text-decoration:none;">
                                    <li class="list-group-item list-group-item-action d-flex fs-5 justify-content-between align-items-center">
                                    ${coins[i].name} to ${fiats[j].symbol}
                                    <em class="badge text-warning">${priceWithCommas(price.toFixed(5))}</em>
                                    </li>
                                </a>
                            `;
                            document.querySelector('#topConversion').innerHTML+=output;
                        }
                        
                    }
                }

            }
        },
        showRankersList:(list)=>{
            let output='';
            for(item of list){
                let slope='up';
                let color='rgb(9, 219, 100)';
                if(item.quote['USD'].percent_change_24h < 0){
                    slope='down';
                    color='rgb(237, 5, 5)';
                }
                output+=`
                <li class="list-group-item d-flex bg-transparent text-white">
                    <a href="/converter/${(item.symbol).toLowerCase()}"class="flex-fill text-danger px-1" style="text-decoration:none">
                        ${item.name}
                    </a>
                    <span class="badge" style="color:${color};font-style:italic;font-size:.9em;"><i class="fa fa-arrow-${slope}"></i> ${(item.quote['USD'].percent_change_24h).toFixed(3)}%</span>
                </li>
                `;
            }
            document.querySelector(UISelectors.rankersList).innerHTML=output;
        },
        showGainersList:(list)=>{
            let output='';
            for(item of list){
                let slope='up';
                let color='rgb(9, 219, 100)';
                if(item.quote['USD'].percent_change_24h < 0){
                    slope='down';
                    color='rgb(237, 5, 5)';
                }
                output+=`
                <li class="list-group-item d-flex bg-transparent text-white">
                    <a href="/converter/${(item.symbol).toLowerCase()}"class="flex-fill text-danger px-1" style="text-decoration:none">
                        ${item.name}
                    </a>
                    <span class="badge" style="color:${color};font-style:italic;font-size:.9em;"><i class="fa fa-arrow-${slope}"></i> ${(item.quote['USD'].percent_change_24h).toFixed(6)}%</span>
                </li>
                `;
            }
            document.querySelector(UISelectors.gainersList).innerHTML=output;
        },
        showNewbieList:(list)=>{
            let output='';
            for(item of list){
                output+=`
                <li class="list-group-item d-flex bg-transparent text-white">
                    <a href="/converter/${(item.symbol).toLowerCase()}"class="flex-fill text-danger px-1" style="text-decoration:none">
                        ${item.name}
                    </a>
                    <span class="badge text-primary" style="font-style:italic;font-size:.9em;"> $ ${(item.quote['USD'].price).toFixed(7)}</span>
                </li>
                `;
            }
            document.querySelector(UISelectors.newbieList).innerHTML=output;
        }
    }  
})(APICtrl);





const APPCtrl = (function(UICtrl,APICtrl){
    const UISelectors = UICtrl.getUISelectors();

    // Event Listeners
    document.addEventListener('DOMContentLoaded', (e)=>{
        APICtrl.getNewsData();
        APICtrl.getRankersList("market_cap",3);
        APICtrl.getGainersList("percent_change_24h",3);
        APICtrl.getNewbieList("percent_change_24h",3);
        coinRankings(e);
        UICtrl.showTopConversions();

    });

    document.querySelector(UISelectors.convert).addEventListener('click', convertionDetails);
    document.querySelector(UISelectors.fromSelect).addEventListener('change',getRates);
    document.querySelector(UISelectors.toSelect).addEventListener('change',getRates);
    document.querySelector(UISelectors.swap).addEventListener('click', swapOptions);
    document.querySelector(UISelectors.menuToggler).addEventListener('click', menuFixed);
    

    // Nav menu events
    let menu = document.querySelector(UISelectors.mainMenu);
    let flag=0;

    document.addEventListener('scroll',()=>{
        if(window.scrollY === 0){
            menu.style.background = 'transparent';
        }else{
            menu.style.background = '#0f0e13';
        };
    })

    function menuFixed(){
        flag++;
        if(flag%2==0 && window.scrollY==0){
            menu.style.background='transparent';
        }else{
            menu.style.background="black";

        }
    }

    // Event Functions
    function convertionDetails(e){
        // Getting IDs and value
        const fromSelect = document.querySelector(UISelectors.fromSelect);
        let fromID = fromSelect.options[fromSelect.selectedIndex].id;
        const toSelect = document.querySelector(UISelectors.toSelect);
        let toID = toSelect.options[toSelect.selectedIndex].id;
        let amt = document.querySelector(UISelectors.quantity).value;
        if(amt ===`` || amt < 0){
            document.querySelector(UISelectors.result).innerHTML=``;
            let error = 'Enter Positive Amount of currency to be converted';
            document.querySelector(UISelectors.result).innerHTML=`
                <div class="alert alert-dismissible alert-danger mb-0">
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    <strong>Error</strong><br>
                    ${error}
                </div>
            `;
        }else{
           try{
             APICtrl.getFinalConvertion(fromID,toID,amt);                                             
            console.log(fromID, toID, amt);
            }catch{
                alert("This conversion is not possible, we are so sorry for this inconvenience")
            }
        }
        e.preventDefault();
    }

    function coinRankings(e){
        APICtrl.getFiats(5000);
        APICtrl.getCoins(5000);
        e.preventDefault();
    }

    

    function getRates(e){
        const fromSelect = document.querySelector(UISelectors.fromSelect);
        let fromID = fromSelect.options[fromSelect.selectedIndex].id;
        const toSelect = document.querySelector(UISelectors.toSelect);
        let toID = toSelect.options[toSelect.selectedIndex].id;
        try {
            APICtrl.getConvertionRate(fromID,toID);
        } catch (error) {
            alert("This conversion is not possible, we are so sorry for this inconvenience")
        }
    }

    function swapOptions(e){;
            const fromSelect = document.querySelector(UISelectors.fromSelect);
            const from = fromSelect.options[fromSelect.selectedIndex].textContent;
            const toSelect = document.querySelector(UISelectors.toSelect);
            const to = toSelect.options[toSelect.selectedIndex].textContent;

            for(let i =0;i<fromSelect.options.length;i++){
                if(fromSelect.options[i].textContent === to){
                    fromSelect.options[i].selected = true;
                }
            }
            for(let i =0;i<toSelect.options.length;i++){
                if(toSelect.options[i].textContent === from){
                    toSelect.options[i].selected = true;
                }
            }
            
            getRates();

            e.preventDefault();
    }
    
})(UICtrl,APICtrl)