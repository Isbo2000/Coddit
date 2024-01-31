//runs when the page loads in
function start() {
    //define/initialize tooltip for navigation sidebar
    tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
    //define/initialize search bar
    sq = document.querySelector('#searchtable');
    sq.addEventListener('focus', ()=>{
        document.getElementById("searchIcon").style.border = '1px solid #5865F2';
        document.getElementById("searchIcon").style.borderRight = 'none';
    });
    sq.addEventListener('focusout', ()=>{
        document.getElementById("searchIcon").style.border = '1px solid rgb(68, 68, 68)';
        document.getElementById("searchIcon").style.borderRight = 'none';
    });
    sq.addEventListener('keyup', function(event){
        if (event.keyCode === 13) {
            event.preventDefault()
            document.getElementById("searchIcon").click();
        } else if (srch && !sq.value) {
            document.getElementById("NoResults").style.display = "none";
            load(sortpage(sort))
        }
    })
    //define/initialize scroll to top button
    window.onscroll = function() {
        mybutton = document.getElementById("backToTop");
        if (document.body.scrollTop > 250 || document.documentElement.scrollTop > 250) {
            mybutton.style.display = "block";
        } else {
            mybutton.style.display = "none";
        }
    };
    //define/initialize splash text and display table
    $(document).ready(function () {
        pastdata();
        srch = false;
        storetable = [];
        sortable = []
        splashtext();
        //get url parameters
        const params = new URLSearchParams(window.location.search)
        page = params.get("p") ? params.get("p") : "This Month"
        sort = params.get("sort") ? params.get("sort") : "total"
        params.get("light_mode") ? darkmode() : null
        //get table
        load(getpage(page, sort, true));
    });
}

//change cursor when loading things
function load(func) {
    document.body.classList.remove("load");
    func
    setTimeout(() => {document.body.classList.add("load");}, 200)
}

//scroll to top button
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

//random display text
function splashtext() {
    let splash = [
        "A break from reddit every so often is always helpful!","All things are difficult before they are easy","Be you","Be yourself more",
        "Call your local crisis line when things get especially sticky","Chill oooouuuuutttt B)","Don't light yourself on fire to keep others warm",
        "Good work!","Hai B)","HEY! YOU, YES YOU, YOU. YOU'RE AMAZING!","Holding on to anger is like drinking poison and hoping the other person dies",
        "I like your style","Impressive","In through the nose and out through the mouth","It's important to stay independent",
        "It's only embarrassing if you're embarrassed","Just keep swimming Just keep swimming Just keep swimming...","Keep it up","Keep on swimming",
        "People who are goodlooking but have terrible personalities are basically real life clickbaits","Pleasure to meet you","Remember to breathe",
        "r/teenagersbutpog, since April 10, 2021","Show the world who you are, because who you are is an amazing person","Square up!","Stay true to you!",
        "Take breaks!","Talk to a trusted family member or friend whenever you get into a pickle","There's a tbp discord, go check it out!",
        "The secret of getting ahead is getting started","Those who matter don't mind and those who mind don't matter","Treat yourself","Treat yourself you deserve it",
        "Welcome!","We love having you around","We love you for you","When life shuts a door, open it again, it's a door, that's how they work",
        "When something is important enough, you do it even if the odds are not in your favor","Woah, impressive","Woah, quite the reddit usage there!",
        "Work it!","You are an incredible person","You look wonderful! You should show everyone sometime","You make people's days","You matter","You matter to us",
        "You're perfect just the way you are","You're probably smart enough to do a crossword puzzle in pen","You're worthy",
        "Your friends probably love you more than you realize, damn","You will meet people that see a lot more in you than you do in yourself"
    ]
    document.getElementById("help").innerHTML = splash[Math.floor(Math.random() * splash.length)];
}

//darkmode
function darkmode() {
    //get the current url
    const params = new URLSearchParams(window.location.search);

    //toggle dark/light mode
    document.body.classList.toggle("dark-mode");
    if (document.getElementById("theme").textContent == "Light Mode") {
        params.set("light_mode", true);
        document.getElementById("theme").textContent = "Dark Mode"
    } else {
        params.delete("light_mode");
        document.getElementById("theme").textContent = "Light Mode"
    };

    //set url parameters
    const state = {
        title: window.location.title,
        url: window.location.href
    };
    history.replaceState(state, "", window.location.pathname+"?"+params);
}

//opening and closing the navigation sidebar
function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("mySidebar").style.width = "65%";
    document.getElementById("main").style.opacity = "0.6";
}
function w3_close() {
    document.getElementById("main").style.opacity = "1";
    document.getElementById("mySidebar").style.display = "none";
}

//searching through data
function entsearch() {
    var sch = document.getElementById("searchtable");
    var input = sch.value.toUpperCase();
    if (srch && !input) {
        document.getElementById("NoResults").style.display = "none";
        load(sortpage(sort))
    } else if (input) {
        load(search(input))
    }
}
function search(input) {
    srch = true
    //clears currently displayed table
    for (var i = user_data.rows.length - 1; i > 1; i--) {
        user_data.deleteRow(i);
    }
    //gets search results and stores them in variable
    var stbl = []
    for (var i = 0; i < storetable.length; i++) {
        var name = storetable[i].split('</td><td><a href= https://reddit.com/user/').pop().split('</a></td><td>')[0].split('>').pop()
        if (name.toUpperCase().indexOf(input) > -1) {
            stbl.push(storetable[i])
        }
    }
    //to limit display table to 1000 rows
    if (stbl.length > 1000) {
        var stlen = 1000
        document.getElementById("NoResults").style.display = "none";
    } else if (stbl.length < 1) {
        document.getElementById("NoResults").style.display = "inline-block";
    } else {
        var stlen = stbl.length
        document.getElementById("NoResults").style.display = "none";
    }
    //adds search results to displayed table
    for (var i = 0; i < stlen; i++) {
        $('#user_data').append(stbl[i]);
    }
}

//sorting data by either posts comments or both
function sortpage(sort,reload) {
    srch = false;
    $(document).ready(function () {
        //set url params
        if (!reload){
            const params = new URLSearchParams(window.location.search);
            params.set("sort", sort);
            const state = {
                title: window.location.title,
                url: window.location.href
            };
            history.replaceState(state, "", window.location.pathname+"?"+params);
        };
        //clear table and reset info text
        document.getElementById("searchtable").value = ""
        document.getElementById("disp-p-s").textContent = page.replace("_"," ")+" ~ sorted by "+sort
        //different sort methods
        if (sort=='total'){
            //total
            sortable.sort(function(a, b) {return (b[1]+b[2]) - (a[1]+a[2])});}
        else if (sort=='posts'){
            //posts
            sortable.sort(function(a, b) {return b[1] - a[1]});
        }
        else if (sort=='comments'){
            //comments
            sortable.sort(function(a, b) {return b[2] - a[2]});
        }
        //clears currently displayed table
        var rowCount = user_data.rows.length;
        for (var i = rowCount - 1; i > 1; i--) {
            user_data.deleteRow(i);
        }
        //adds sorted data to variable
        storetable = [];
        for (var i = 0; i < sortable.length; i++) {
            var student = "<tr><td>";
            student += i + 1;
            student += "</td><td>";
            student += "<a href= https://reddit.com/user/" + sortable[i][0] + ">";
            student += sortable[i][0];
            student += "</a>";
            student += "</td><td>";
            student += sortable[i][1];
            student += "</td><td>";
            student += sortable[i][2];
            student += "</td><td>";
            student += sortable[i][1] + sortable[i][2];
            student += "</td></tr>";
            storetable.push(student)
        };
        //to limit display table to 1000 rows
        if (storetable.length > 1000) {
            var stlen = 1000
        } else {
            var stlen = storetable.length
        }
        //adds data to displayed table
        for (var i = 0; i < stlen; i++) {
            $('#user_data').append(storetable[i]);
        }
    })
}

//fetches data on page load or when different data selected
function getpage(page,sort,l,reload) {
    $(document).ready(function () {
        w3_close()
        //set url params
        if (!reload){
            const params = new URLSearchParams(window.location.search);
            params.set("p", page);
            const state = {
                title: window.location.title,
                url: window.location.href
            };
            history.replaceState(state, "", window.location.pathname+"?"+params);
        };
        //fetches data from database
        url = `https://isbo-coddit-default-rtdb.firebaseio.com/${page}.json`
        fetch(url).then(response => {return response.json();}).then(function (data) {
            //stores data in variable
            sortable = [];
            for (var user in data) {
                sortable.push([user, data[user][0], data[user][1]]);
            }
            //calls sort function to display+sort data
            sortpage(sort,reload)
        });
    });
}

//loads past data sidebar options
function pastdata() {
    $(document).ready(function () {
        var url = "https://isbo-coddit-default-rtdb.firebaseio.com/Index.json"
        fetch(url).then(response => {return response.json();}).then(function (data) {
            //months
            for (let i = 0; i < data.months.length; i++) {
                let month = "<li><button id='months' class='tablinks' onclick=load(getpage(page='";
                month += data.months[i].name.replace(" ","_");
                month += "',sort));>";
                month += data.months[i].name;
                month += "<i style='color:grey;float:right;margin-right:1px' class='bi bi-info-circle' data-bs-toggle='tooltip' data-bs-placement='right' title='";
                month += (data.months[i].tooltip ? data.months[i].tooltip : `Data from ${data.months[i].name}`);
                month += "'></i></button></li>";
                $('#olderMonths').append(month);
            }
            //years
            for (let i = 0; i < data.years.length; i++) {
                let year = "<li><button id='years' class='tablinks' onclick=load(getpage(page='";
                year += data.years[i].name;
                year += "',sort));>";
                year += data.years[i].name;
                year += "<i style='color:grey;float:right;margin-right:1px' class='bi bi-info-circle' data-bs-toggle='tooltip' data-bs-placement='right' title='";
                year += (data.years[i].tooltip ? data.years[i].tooltip : `Data from ${data.years[i].name}`);
                year += "'></i></button></li>";
                $('#olderYears').append(year);
            }
        });
    });
}