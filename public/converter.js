const coinCap = new CoinMarket;


// let from = document.querySelector(".converter").id;
// from = from.toUpperCase();

// API 
const APICtrl = (()=>{
    const coinCap = new CoinMarket;

    return{
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
        getDesciption:(symbol)=>{
            coinCap.getCoin(symbol)
             .then(data=>{
                UICtrl.showDesciption(data);
             })
              .catch(err=> console.log(err));
        },
        getConvertionRate:(from,to)=>{
            coinCap.getConvertion(from,to,1)
                .then(data => {    
                   UICtrl.showConvertedRate(data);
                //    console.log(data);
                })
                 .catch(() => alert('This Conversion is not possible. We are so sorry for the inconvenience.'))
        },
        getFinalConvertion: (from,to,amt)=>{
            coinCap.getConvertion(from,to,amt)
                .then(data => {    
                   UICtrl.showConvertedCurrency(data);
                   console.log(data);
                })
                 .catch(()=>alert('This Conversion is not possible. We are so sorry for the inconvenience.'))
        }
    }
})()

// UI
const UICtrl =(()=>{
    const UISelectors = {  
        convert:'#convertCurr',
        convertionRate:'#convertionRate',
        quantity:'#quantity',
        result:'#result',
        formSelect:'form-select',
        fromSelect:'#fromSelect',
        toSelect:'#toSelect',
        infoContainer:'#info-converter'
    }

    return{
        getUISelectors:()=>{
            return UISelectors;
        },
        showCoins:(ranking)=>{
            console.log(1);
            let upperSelect='';
            for(let i =0;i<ranking.length;i++){
                if(ranking[i].symbol === 'BTC'){
                    upperSelect+=`
                        <option id="${ranking[i].symbol}" selected>${ranking[i].symbol} - ${ranking[i].name}</option>
                    `
                }else{
                    upperSelect+=`
                        <option id="${ranking[i].symbol}">${ranking[i].symbol} - ${ranking[i].name}</option>
                    `
                }
            };
            let lowerSelect = '';
            for(let i =0;i<ranking.length;i++){
                lowerSelect+=`
                    <option id="${ranking[i].symbol}">${ranking[i].symbol} - ${ranking[i].name}</option>
                `
            };
            document.querySelector(UISelectors.fromSelect).innerHTML+=upperSelect;
            document.querySelector(UISelectors.toSelect).innerHTML+=lowerSelect;
        },
        showFiats:(ranking)=>{
            console.log(0);
            let output='';
            for(let i =0;i<ranking.length;i++){
                output+=`
                    <option id="${ranking[i].symbol}">${ranking[i].symbol} - ${ranking[i].name}</option>
                `
            };
            output+='<option disabled="disabled">Crypto Coins</option>';
            document.querySelector(UISelectors.fromSelect).innerHTML=output;
            document.querySelector(UISelectors.toSelect).innerHTML=output;
        },
        showConvertedRate:(data)=>{
            const fromField = document.querySelector(UISelectors.fromSelect)
            const fromName= fromField.options[fromField.selectedIndex].textContent;
            const fromNameArr = fromName.split(' -');

            const toField = document.querySelector(UISelectors.toSelect);
            const toName = toField.options[toField.selectedIndex].textContent;
            const toNameArr = toName.split(' -');

            let toID = toSelect.options[toSelect.selectedIndex].id;

            let output = `
                ${fromNameArr[0]}/${toNameArr[0]}: <span class="text-dark" style="font-weight:800">${(data[0].quote[toID].price).toFixed(3)}</span>
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
            const toID = toSelect.options[toSelect.selectedIndex].id;
            let output = `
                <div class="card-body">
                    <h4 class="card-title text-center">${data[0].amount} ${fromNameArr[0]} = ${(data[0].quote[toID].price).toFixed(3)} ${toNameArr[0]}</h4>
                </div>
            `;
            // console.log(output);
            document.querySelector(UISelectors.result).innerHTML=output;
        },
        showTopConversions:()=>{
            const coinCap = new CoinMarket();

            coinCap.getCoin('BTC').then(coin => {
                coinCap.getFiats(10).then(fiats => getRates(coin,fiats));
            })

            function getRates(coin,fiats){
                document.querySelector('#topConversion').innerHTML='';

                for(let j=0;j<fiats.length;j++){
                    coinCap.getConvertion(coin['BTC'].symbol,fiats[j].symbol,1).then(data => createHTML(data[0].quote[fiats[j].symbol].price));
                    function createHTML(price){
                        let output='';
                        output=`
                            <a href="#" style="text-decoration:none;">
                                <li class="list-group-item list-group-item-action d-flex fs-5 justify-content-between align-items-center">
                                ${coin['BTC'].name} to ${fiats[j].symbol}
                                <em class="badge">${price.toFixed(3)}</em>
                                </li>
                            </a>
                        `;
                        document.querySelector('#topConversion').innerHTML+=output;
                    }
                }

            }
        },
        showDesciption:(data)=>{
            const coin = data['BTC']
             let output=`
             <div class="card-body">
                <h4 class="card-title fs-3" style="font-weight: 600;"><a href="${coin.urls.website}"><img src="${coin.logo}"class="img px-3"style="width:100px;"/></a>${coin.name} Exchange Rate CalC</h4>
                <p class="card-text">${coin.description}</p>
            </div>
             `;
             document.querySelector(UISelectors.infoContainer).innerHTML = output;
        }
    }
})()




// APP
const APPCtrl = ((APICtrl,UICtrl)=>{
    const UISelectors = UICtrl.getUISelectors();
    document.querySelector(UISelectors.convert).addEventListener('click', convertionDetails);
    document.querySelector(UISelectors.fromSelect).addEventListener('change',getRates);
    document.querySelector(UISelectors.toSelect).addEventListener('change',getRates);
    document.addEventListener('DOMContentLoaded',(e)=>{
        // coinRankings(e);
        // getRates(e);
        APICtrl.getDesciption('BTC');
        // UICtrl.showTopConversions();
    })

    // Event Functions
    function getRates(e){
        const fromSelect = document.querySelector(UISelectors.fromSelect);
        let fromID = fromSelect.options[fromSelect.selectedIndex].id;
        const toSelect = document.querySelector(UISelectors.toSelect);
        let toID = toSelect.options[toSelect.selectedIndex].id;
        APICtrl.getConvertionRate(fromID,toID);
    }

    function coinRankings(e){
        APICtrl.getFiats(5000);
        APICtrl.getCoins(5000);
        e.preventDefault();
    }

    function convertionDetails(e){
        // Getting IDs and value
        const fromSelect = document.querySelector(UISelectors.fromSelect);
        let fromID = fromSelect.options[fromSelect.selectedIndex].id;
        const toSelect = document.querySelector(UISelectors.toSelect);
        let toID = toSelect.options[toSelect.selectedIndex].id;
        let amt = document.querySelector(UISelectors.quantity).value;
        if(amt ===``){
            alert('Enter Amount of currency to be converted');
        }else{
            APICtrl.getFinalConvertion(fromID,toID,amt);                                             
            console.log(fromID, toID, amt);
        }
        e.preventDefault();
    }
})(APICtrl,UICtrl)
