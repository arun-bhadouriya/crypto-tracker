// const { html2pdf } = require("./html2pdf.bundle.min");

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'e113bfbd7amsh3ff0b070e7e3be2p109475jsn440d29eeb3dd',
		'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
	}
};

document.body.style={
    width:"100vw",
    display:"flex",

}

let down="https://s2.svgbox.net/hero-outline.svg?ic=trending-down&color=ff0505";
let up ="https://s2.svgbox.net/hero-outline.svg?ic=trending-up&color=199442";

function setColorChanges(){
    document.querySelectorAll('.change').forEach(item=>{
        let t = parseFloat(item.textContent)
        let imageElement = document.createElement('img');
        imageElement.setAttribute('width','20');
        imageElement.setAttribute('height','20');
        
        if(t<0){
            imageElement.setAttribute('src',down);
            item.setAttribute("class", `${item.getAttribute('class')} text-danger`);
        } 
        else{
            imageElement.setAttribute('src',up);
            item.setAttribute("class",`${item.getAttribute('class')} text-success`);
        }

        item.appendChild(imageElement);
    })
}

// pagination functionalities start //////////////////////////////////////////////////////
let offset=0;
let limit=20;

let a =document.querySelectorAll('.page-link');
let prevInterval;
a.forEach(element => {
    element.addEventListener('click',(e)=>{
        clearInterval(prevInterval);
        
        if(element.textContent==='1'){
            console.log(1);
            limit=20;
            offset = 0;
        }else if(element.textContent==='2'){
            console.log(2);
            limit=20;
            offset=20;
        }else if(element.textContent==='3'){
            console.log(3);
            limit = 20;
            offset = 40;
        }
        else if(element.textContent==='Next'){
            offset+=20;
            
        }else{
            offset-=20;
        }
        if(offset>=20){
            a[0].parentNode.removeAttribute('class')
            a[0].parentNode.style.cursor='pointer'  
            console.log(a[0].parentNode)
        }else{
            a[0].parentNode.setAttribute('class','disabled')
        }
        console.log(limit,offset)
        let interval = getData(limit,offset);
        prevInterval = interval;
    })
})
// pagination functionalities end //////////////////////////////////////////////////////////

// function to check if price increased or not from prev
// function checkPrice(price, prevPrice){
//     return price>prevPrice
// }

let prevPrice=0;

function getData(limit,offset){
    document.getElementById('coins').style.display='none';
    
    document.getElementById('loader').style.display="flex";
    let interval = setInterval(() => {
    
        fetch(`https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers%5B0%5D=1&orderBy=marketCap&orderDirection=desc&limit=${limit}&offset=${offset}`, options)
        .then(response => response.json())
        .then(response => {
            document.body.style.width="auto"
            document.body.style.height="auto"
            document.body.style.display=null;
            document.body.style.alignItems=null;
            document.body.style.justifyContent=null;
            document.getElementById('coins').style.removeProperty('display');
            console.log(response)
            let coinsData="";
            Object.entries(response.data.coins).forEach(item => {
                let price = parseFloat(item[1].price).toFixed(2);
                coinsData+=`
                    <tr>
                        <td>${item[1].rank}</td>
                        <td>
                            <a class="table-link" href="${item[1].coinrankingUrl}" target="_blank">
                                <img src="${item[1].iconUrl}" alt="" width="30" height="30"> &nbsp;${item[1].name} &nbsp; <span class="sym">${item[1].symbol}</span>
                            </a>
                        </td>
                        <td style="font-weight:500;">$${parseFloat(item[1].price)>1?parseFloat(item[1].price).toFixed(2):parseFloat(item[1].price).toFixed(8)} </td>
                        <td class="change priceChange">${item[1].change}%</td>
                        <td style="font-weight:500;">${item[1].marketCap}</td>
                        <td style="font-weight:500;">${item[1]["24hVolume"]}</td>
                    </tr>
                `
            })
            
            document.getElementById('loader').style.display="none";
            document.querySelector('#coins tbody').innerHTML=coinsData;
            setColorChanges();
            
        })

        .catch(err => console.error(err));
    }, 2000);
    download();
    return interval
}

let interval = getData(limit,offset);
prevInterval = interval;







// searching functionality
let coinSymbolUID = [];
let res;
fetch(`https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers%5B0%5D=1&orderBy=marketCap&orderDirection=desc&limit=500&offset=0`, options)
	.then(response => response.json())
	.then(response => {
        res = response.data.coins
        for(let coins of response.data.coins){
            let entry = {
                id:coins.uuid,
                name:coins.name,
                symbol:coins.symbol
            }
            coinSymbolUID.push(entry);
        }
        console.log(response.data.coins);
    })

	.catch(err => console.error(err));


let input = document.getElementsByClassName('search')[0];

let arr;
input.addEventListener("input",(e)=>{
    if(e.target.value==""){
        let interval = getData(30,0);
        prevInterval = interval
        return;
    }
    clearInterval(prevInterval)
    arr = res.filter(element => {
        let coinName = element.name.toLowerCase();
        let subCoinName = e.target.value.toLowerCase();
        let symbolName = element.symbol.toLowerCase(); 
        return coinName.includes(subCoinName) || symbolName.includes(subCoinName)
    });
    let coinsData="";
        
        for(let item of arr){
            
            coinsData+=`
                <tr style=";">
                    <td>${item.rank}</td>
                    <td><img src="${item.iconUrl}" alt="" width="30" height="30"> &nbsp;${item.name} &nbsp; <span class="sym">${item.symbol}</span></td>
                    <td>$${parseFloat(item.price)>1?parseFloat(item.price).toFixed(2):parseFloat(item.price).toFixed(8)} </td>
                    <td class="change priceChange">${item.change}%</td>
                    <td>${item.marketCap}</td>
                    <td>${item["24hVolume"]}</td>
                </tr>
            `
        }
        document.querySelector('#coins tbody').innerHTML=coinsData;
        setColorChanges();
    console.log(e.target.value);
})



// functionality for downloading data
function download(){
    
    let options = document.querySelectorAll('input[name="options"]');
    let download = document.querySelector('.download')
    download.addEventListener('click',()=>{
        let a = options[0];
        let b = options[1];
        if(a.checked){
            // implement to download as pdf
            let coins = document.querySelector(".table");
            var opt = {
                margin:       1,
                filename:     'coins-data.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
              };

               html2pdf(coins,opt);
        }
        else{
            // implement to download as excel sheet
            var table2excel = new Table2Excel();
            table2excel.export(document.querySelector(".table"));
        }
    })

}