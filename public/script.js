var submit =document.getElementById("btn");
var keyword = document.getElementById("keyword");
var state = document.getElementById("state-select")
var parentElements = document.querySelectorAll(".col");
const backend = new URL("http://localhost:5000/search?");
const prevPage = document.querySelector('#prev-page');
const nextPage = document.querySelector('#next-page');
const container = document.getElementById("display-container");
const detail = document.getElementById("detail");
var results=[];
let map;
let marker;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39.003, lng: -122.4194 },
    zoom: 8,
    });
    marker = new google.maps.Marker({
        position:{ lat:39.003, lng: -122.4194 }, // set initial marker position
        map: map, // set the marker to appear on the map
        title: "target", 
    });
}

async function fetchData(url) { //fetch api from provided url
    let response = await fetch(url);
    if (response.status == 200) {
        data = await response.json();
        return data;
    }
}
const itemsPerPage=9;
var currentPage=1;
function displayItems(startIndex){
    endIndex = startIndex+itemsPerPage;
    const items = results.slice(startIndex,endIndex);
    return items;
}

function createTable(object){
    table = document.createElement("table");
    table.innerHTML="";
    let mybody = table.createTBody();
    const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    for(let i = 0; i<7; i++){ 
        let row = mybody.insertRow();
        const col1 = row.insertCell(); 
        col1.textContent = daysOfWeek[i].charAt(0).toUpperCase() + daysOfWeek[i].slice(1);
        col1.style["font-weight"]="bold";
        const col2= row.insertCell();
        col2.textContent = object[daysOfWeek[i]];
    }
    return table;
}

function validation(){
    if(!keyword.checkValidity()&&state.value==""){
        keyword.reportValidity();
        return false;
    }else{
        return true;
    } ;
}

window.onload = function(){ 
    window.initMap = initMap;
    submit.onclick=()=>{
        if(validation()==true){
            backend.searchParams.set('q',keyword.value);
            backend.searchParams.set('stateCode',state.value);
            fetchData(backend).then(data=>{
                results=data;
                data.onload=generateGrid(displayItems(0));
                updatePagination();
            })
        }
    }

    function generateGrid(results){
        container.style.display="block";
        detail.style.display="none";
        parentElements.forEach((element)=>{
            element.innerHTML="";
        })
        results.forEach((element,index) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.style.width="25rem";
            const cardTitle = document.createElement("h5");
            cardTitle.classList.add("card-title");
            cardTitle.innerText = element.fullName;
            const cardImg = document.createElement("img");
            cardImg.classList.add("card-img-top");
            cardImg.src=element.images[0].url;
            const overlay = document.createElement("div");
            overlay.classList.add("card-img-overlay");
            overlay.innerHTML="<p class='card-text'>"+element.description+"</p>"
            card.appendChild(cardImg);
            card.appendChild(cardTitle);
            card.appendChild(overlay);
            parentElements[index].appendChild(card);
            card.onclick=()=>{
                displayDetail(element);
                detail.style.display="block";
                container.style.display="none";
            }
        });
        document.getElementById("display-container").scrollIntoView();
    }

    function displayDetail(detailObj){
        detail.scrollIntoView();
        const carousel = document.getElementById("carouselExampleSlidesOnly");
        const inner = document.querySelector(".carousel-inner");

        if(document.getElementById("park")==null){
            const back = document.createElement("button");
            back.classList.add("btn","btn-outline-dark");
            back.textContent="Back";
            back.onclick=()=>{
                detail.style.display="none";
                container.style.display="block";
            }
            detail.insertBefore(back,carousel);
            const head = document.createElement("h2");
            head.id=('park');
            head.innerHTML=detailObj["fullName"];
            detail.insertBefore(head,carousel);
            detail.insertBefore(document.createElement('hr'),carousel);
        }else{
            document.getElementById('park').innerHTML=detailObj["fullName"];
        }

        inner.innerHTML="";
        detailObj.images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.classList.add('carousel-item');
            if (index === 0) {
              slide.classList.add('active');
            }
            const slideImage = document.createElement('img');
            slideImage.classList.add('d-block', 'w-100');
            slideImage.src = image.url;
            slideImage.alt = "This is a picture of the park.";
            slide.appendChild(slideImage);
            inner.appendChild(slide);
        });
        if(document.getElementById("info")!=null){
            detail.appendChild(document.getElementById("map"));
            document.getElementById("info").innerHTML="";
            detail.removeChild(document.getElementById('info'));
        }
        const infoSection = document.createElement("div");
        infoSection.id="info";
        detail.appendChild(infoSection);

        subheading = [];
        subheads=["Operating Hours","Directions","Weather","Things To Do", "Map","More info"];
        for(let i = 0;i<subheads.length;i++){
            subheading.push(document.createElement('h4'));
            subheading[i].innerHTML = subheads[i];
            infoSection.append(subheading[i]);
        }
        mytable = createTable(detailObj.operatingHours[0].standardHours);
        infoSection.appendChild(mytable);
        infoSection.insertBefore(mytable,subheading[1]);

        const row= document.createElement("div");
        row.innerHTML="<div></div> <div></div>";
        infoSection.insertBefore(row,subheading[3]);

        const weatherInfo = document.createElement("p");
        weatherInfo.textContent=detailObj.weatherInfo;
        row.lastChild.appendChild(weatherInfo);
        var weatherUrl=new URL("http://localhost:5000/weather?");
        weatherUrl.searchParams.set("latitude",detailObj.latitude);
        weatherUrl.searchParams.set("longitude",detailObj.longitude);
        fetchData(weatherUrl).then(data=>{
            row.firstChild.innerHTML = "<p id='temp'>"+data.temp_f+"°F</p>" +"<img src='" +data.condition.icon+ "' width=70px height = 70px>";
        })
        const directions = document.createElement("p");
        directions.textContent = detailObj.directionsInfo;
        infoSection.insertBefore(directions,subheading[2]);//insert google map;
        infoSection.appendChild(document.getElementById('map'));
        infoSection.insertBefore(document.getElementById('map'),subheading[5]);
        
        const latitude=parseFloat(detailObj.latitude) ;
        const longitude=parseFloat(detailObj.longitude);
        map.setCenter({lat:latitude,lng:longitude});
        marker.setPosition({lat:latitude,lng:longitude});
        const url = document.createElement("a");
        url.href = detailObj.url;
        url.target='_blank';
        url.innerHTML = 'Visit Official Website';
        subheading[5].after(url);

        var detailurl="http://localhost:5000/detail?parkCode="+detailObj.parkCode;
        fetchData(detailurl).then(data=>{
            if(data==null||data==undefined||data.length===0){
                subheading[3].style.display="none";
            }
            for(let i = 0; i < data.length; i++){
                const thing = document.createElement("p");
                infoSection.insertBefore(thing,subheading[4]);
                thing.innerHTML="<span style='font-weight:bold'> "+data[i].title+": </span>"+ data[i].description;
            }
        })
    }
    function updatePagination() {
        numPages = Math.ceil(results.length / itemsPerPage);
        var pageLink = document.querySelectorAll(".page-link");
        let elemToRemove = prevPage.nextSibling;
        while (elemToRemove && elemToRemove !== nextPage) {
            const nextSibling = elemToRemove.nextSibling;
            document.querySelector('.pagination').removeChild(elemToRemove);
            elemToRemove=nextSibling;
        }
        for (let i = 1; i <= numPages; i++) {
        pageLink = document.createElement('a');
        pageLink.classList.add("page-link");
        pageLink.href = '#';
        pageLink.innerText = i;
        pageLink.addEventListener('click', () => {
            newItem = displayItems((i-1)*9);
            generateGrid(newItem);
            currentPage=i;
        });
        document.querySelector(".pagination").insertBefore(pageLink,nextPage);
        }
    }

    prevPage.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage -= 1;
          const startIndex = (currentPage - 1) * itemsPerPage;
          prevItem=displayItems(startIndex);
          generateGrid(prevItem);
        }
      });
    nextPage.addEventListener('click', () => {
        if (currentPage < numPages) {
          currentPage += 1;
          const startIndex = (currentPage - 1) * itemsPerPage;
          displayItems(startIndex);
          nextItem=displayItems(startIndex);
          generateGrid(nextItem);
        }
      });

};

  module.exports = createTable;