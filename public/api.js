class News {
    async getNews(page){
        const newsRes = await fetch(`./news-data?page=${page}`);
        const response = await newsRes.json();
        return response;
    }
    async getMainNews(page){
        console.log('Loader');
        const loader = document.createElement('div');
        loader.innerHTML=`
            <div class="text-center py-3">
                <img src = "assets/loader.gif" height="50px"width="50px" />
            </div>
        `;
        document.querySelector('#main-news-list').append(loader);
        const newsRes = await fetch(`./news-data?page=${page}`);
        const response = await newsRes.json();
        console.log('Loader done');
        document.querySelector('#main-news-list').removeChild(loader);
        return response;
    }
    async getYTVideos(nextToken){
        const loader = document.createElement('div');
        loader.innerHTML=`
            <div class="text-center py-3">
                <img src = "assets/loader.gif" height="50px"width="50px" />
            </div>
        `;
        document.querySelector('#yt-newsList').append(loader);
        const videosRes = await fetch(`./youtube?pageToken=${nextToken}&q=cryptocurrency%20news%7C&maxResults=12`);
        const response = await videosRes.json();
        document.querySelector('#yt-newsList').removeChild(loader);
        return response;
    }
}

class CoinMarket{
    async getCoin(symbol){
        const coinRes = await fetch(`./coin?symbol=${symbol}`);
        const response = await coinRes.json();
        return response.data;
    }
    async getCoins(limit){
        const coinRes = await fetch(`./coins?limit=${limit}`);
        const response = await coinRes.json();
        return response.data;
    }
    async getFiats(limit){
        const fiatRes = await fetch(`./fiats?limit=${limit}`);
        const response = await fiatRes.json();
        return response.data;
    }
    async getConvertion(from,to,amt){
        const conversionRes = await fetch(`./conversion?symbol=${from}&convert=${to}&amount=${amt}`);
        const response = await conversionRes.json();
        return response.data;
    }
    async getListings(sort,limit){
        const listingRes = await fetch(`./listings?sort=${sort}&limit=${limit}`);
        const response = await listingRes.json();
        return response.data;
    }
    async getQuoteLatest(start,limit){
        const listingRes = await fetch(`./listings?start=${start}&limit=${limit}&convert=INR`);
        const response = await listingRes.json();
        return response.data;
    }
}