const UISelectors = {
    menuToggler: '.navbar-toggler',
    mainMenu:'.main-menu',
    newsList:'#main-news-list',
    more:'#more',
    YTmore:'#yt-more',
    YTNewsList:'#yt-newsList'
}

const news = new News;

// Event listeners
document.addEventListener('DOMContentLoaded',(e)=>{
    showNewsItems(e);
    showYTVideos(e);
})
document.querySelector(UISelectors.more).addEventListener('click',showNewsItems);
document.querySelector(UISelectors.YTmore).addEventListener('click',showYTVideos);
document.querySelector(UISelectors.menuToggler).addEventListener('click', menuFixed);






// Main News Article List
function showNewsItems(e){
    function randomNumber(min, max) { 
        return Math.floor(Math.random() * (max - min) + min);
    }
    news.getMainNews(randomNumber(1,10)).then(data =>{
        let output='';
        for(let i=0;i<6;i++){
            output+=`
            <div class="list-group-item list-group-item-action flex-column align-items-start hover bg-transparent white-glassmorphism border-0">
            <a href="${data.articles[i].link}" target="_blank" class="newsHead"style="text-decoration:none">
                <div class="w-100 mb-3">
                    <h3 class="mb-1 fs-4">${data.articles[i].title}</h3>
                    <small class="text-muted"><i class="fa-solid fa-user px-1"></i> ${data.articles[i].author} <i class="fa-solid fa-newspaper px-1"></i> <a href="https://${data.articles[i].clean_url}" target="_blank">${data.articles[i].clean_url}</a> <i class="fa-solid fa-calendar px-1"></i> ${(new Date(data.articles[i].published_date).toDateString()).slice(0,7)} ${(new Date(data.articles[i].published_date)).getFullYear()}</small>
                </div>
            </a>
                <div class="mb-2 row news-data">
                     <a href="${data.articles[i].link}" target="_blank" class="news-head"style="text-decoration:none">

                        <img src="${data.articles[i].media}"class="col-12 mb-3 img-fluid" style="max-height:350px" alt="news thumbnail" />
                        
                        <p class="col-12 mb-1">
                            ${(data.articles[i].summary)}
                        </p>

                    </a>
                    
                </div>   
            </div>
            `;
        }
        document.querySelector(UISelectors.newsList).innerHTML+=output;
    })
}


// YouTube videos list
let nextToken='';
function showYTVideos(e){
    news.getYTVideos(nextToken)
     .then(data => {
        let videos = data.items;
        nextToken = data.nextPageToken;
        let output='';

        videos.forEach(video => {
            output+=`
                <div class="list-group-item list-group-item-action flex-column px-sm-0 bg-transparent blue-glassmorphism text-light">
                    <iframe width="100%" height="auto" src="https://www.youtube.com/embed/${video.id.videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <h4 class="my-3 px-2 fs-5">${video.snippet.title}</h4>
                </div>
            `
        });

        document.querySelector(UISelectors.YTNewsList).innerHTML+=output;
     })
      .catch(err => console.log(err));
}

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