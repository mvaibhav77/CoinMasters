const APICtrl=(()=>{
    const coinCap = new CoinMarket;
    const news = new News; 

    return{
        getNextCoins: (start,limit)=>{
            coinCap.getQuoteLatest(start,limit)
             .then(data=> {
                UICtrl.showCoins(data)
            }).catch(err => console.log(err))
        },
        getLogo:(symbol)=>{
            coinCap.getCoin(symbol)
                .then(data=> data[`${symbol}`].logo)
                    .catch(err=>console.log(err))
        }
    }
})()

const UICtrl = ((APICtrl)=>{
    const UISelectors = {
        menuToggler: '.navbar-toggler',
        mainMenu:'.main-menu',
        tableName:"#table-name",
        tableInfo:"#table-info",
        next:"#next",
        prev:"#prev",
        loader:"#loader",
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
        getUISelector:()=>{
            return UISelectors;
        },
        showCoins:(data)=>{
            let name=``;
            let info=``;

            if(document.querySelector(UISelectors.loader)){
                document.querySelector(UISelectors.loader).remove();
            }
            for(let i=0;i<data.length;i++){
                name+=`
                    <tr class="headers text-light">
                        <th scope="row">${data[i].cmc_rank}</th>
                        <td>
                            <a href="/converter/${(data[i].symbol).toLowerCase()}" style="text-decoration:none;">${data[i].name}</a>
                        </td>
                    </tr>

                `;



                info+=`
                   <tr class="coin-data">
                        <td>${priceWithCommas((data[i].quote.INR.price).toFixed(5))} INR</td>
                        <td class="slope">${(data[i].quote.INR.percent_change_1h).toFixed(4)}</td>
                        <td class="slope">${(data[i].quote.INR.percent_change_24h).toFixed(4)}</td>
                        <td class="slope">${(data[i].quote.INR.percent_change_7d).toFixed(4)}</td>
                        <td>${priceWithCommas((data[i].quote.INR.volume_24h).toFixed(4))}</td>
                        <td>${priceWithCommas((data[i].circulating_supply).toFixed(2))}</td>
                    </tr>
                `;
            }
            
            document.querySelector(UISelectors.tableName).innerHTML= name;
            document.querySelector(UISelectors.tableInfo).innerHTML= info;
            

            for(let i=0;i<150;i++){
                if(Number(document.querySelectorAll('.slope')[i].textContent) < 0 ){
                    document.querySelectorAll('.slope')[i].style.color="#fc0000";
                    document.querySelectorAll('.slope')[i].textContent = Number(document.querySelectorAll('.slope')[i].textContent)-(2*Number(document.querySelectorAll('.slope')[i].textContent));
                }else{
                    document.querySelectorAll('.slope')[i].style.color="#0eed19";
                    
                }
            }


        }

    }
})(APICtrl)


const APPCtrl = ((UICtrl,APICtrl)=>{
    const UISelectors = UICtrl.getUISelector();

    // Event Listeners
    document.querySelector(UISelectors.next).addEventListener('click', nextPageCrypto);
    document.querySelector(UISelectors.prev).addEventListener('click', prevPageCrypto); 
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


    document.addEventListener('DOMContentLoaded',(e)=>{
        APICtrl.getNextCoins(start,50);
    })



    let start=1;

    // Function
    function nextPageCrypto(e){ 
        start +=50;

        APICtrl.getNextCoins(start,50);
        document.querySelector("#prev").removeAttribute('disabled');

        e.preventDefault();
    }

    function prevPageCrypto(e){
        start-=50;
        if(start == 1){
            document.querySelector("#prev").setAttribute("disabled", true)
        }
        APICtrl.getNextCoins(start,50);
        e.preventDefault();
    }

})(UICtrl,APICtrl);