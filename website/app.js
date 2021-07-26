/* HINT : I use traditional function instead of arrow function to get benefit of hoisting */
//
/* declare URL and api key to be used in GET request */ 
// base URL 
const baseURL = "https://api.openweathermap.org/data/2.5/weather?";
// API key, generated from OpenWeatherMap website
const apiKey = "2a0c199ebe702347e13de4ad0c5c8d4e";

/* generate button selector and callback functions */
const generate = document.querySelector("#generate");
generate.addEventListener("click", generator);
// generator function fireing on 'generate' button click
function generator() {
    const zipCode = document.querySelector("#zip").value;
    openWeatherMap(`${baseURL}zip=${zipCode}&appid=${apiKey}&units=metric`)
    .then(checkDataRequested)
    .then(postData)
    .then(updatePageContent)
}
// getting data from OpenWeatherMap
async function openWeatherMap(fullURL) {
    const res = await fetch(fullURL);
    const data = await res.json();
    if(data.cod == 200) console.log(data);
    else console.error(data);
    return data;
}
// check resolve value 
async function checkDataRequested(resolveData) {
    if(resolveData.cod == 200) { // OK
        // getting date , convert it from UNIX format to human readable 
        const d = new Date(resolveData.dt * 1000);
        let month = d.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        let day = d.getDate();
        day = day < 10 ? "0" + day : day;
        const date = `${month}/${day}/${d.getFullYear()}`;
        // generate object to be posted
        const dataSent = {
            temp: resolveData.main.temp,
            date: date,
            city: resolveData.name,
            feel: document.getElementById("feel").value
        }
        console.log(dataSent); // to be posted
        return dataSent;
    } else { // error
        console.error(resolveData);
        document.getElementById("zip").value = "Error input";
        document.getElementById("zip").style.color = "red";
        setTimeout(_=> {
            document.getElementById("zip").value = "";
            document.getElementById("zip").style.color = "#FFD8CC";
            document.getElementById("feel").value = "";
        }, 2000);
        return {city: 0}; //refer to no city detected
    }
}
// posting data to our server
async function postData(resolveDataSent) {
    if(resolveDataSent.city) {
        try{
            const res = await fetch("/add", {
                method: "POST",
                headers: { "Content-Type" : "application/json" },
                body: JSON.stringify(resolveDataSent)
            });
            const state = await res.json();
            console.log(state);
            return state;
        } catch (e) {
            console.error("ERROR : " + e);
            return {city: 0};
        }
    } else {
        // data will not be sent to our server because absolutely there is no data
        console.error("invalid input , written");
        return {city: 0};
    }
}
// update UI interface
function updatePageContent(resolveState) {
    if(resolveState.city) {
        console.log("update UI");
        document.querySelector(".ui").style.display = "flex";
        document.getElementById("city").innerHTML = `City: ${resolveState.city}`;
        document.getElementById("date").innerHTML = `Date: ${resolveState.date}`;
        document.getElementById("temp").innerHTML = `Temp: ${resolveState.temp} <sup>o</sup>C`;
        document.getElementById("feels").innerHTML = `You feel : ${resolveState.feel}`;
    } else {
        console.error("invalid input , written");
    }
}
