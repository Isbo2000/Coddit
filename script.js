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
    //define/initialize scroll to top button
    window.onscroll = function() {
        scrollFunction()
    };
    //define/initialize splash text and display table
    $(document).ready(function () {
        storetable = [];
        sortable = [];
        page = "data";
        n = 0;
        splashtext();
        getpage(page,n,true)
    });
}

//change cursor when loading things
function load(func) {
    document.body.classList.remove("load");
    func
    setTimeout(() => {document.body.classList.add("load");}, 200)
}

//scroll to top button
function scrollFunction() {
    mybutton = document.getElementById("backToTop");
    if (document.body.scrollTop > 250 || document.documentElement.scrollTop > 250) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

//random display text
function splashtext() {
    var items = ["Take breaks!", "Developed by Dimittrikov and Daniel_R013 (and me hehe)", "It's important to stay independent", "Remember to breathe", "In through the nose and out through the mouth",
        "Call your local crisis line when things get especially sticky", "We love having you around", "You're worthy", "A break from reddit every so often is always helpful!", "Stay true to you!",
        "Be you", "You look wonderful! You should show everyone sometime", "Keep it up", "r/teenagersbutpog, since April 2021", "Woah, quite the reddit usage there!", "Impressive",
        "All things are difficult before they are easy", "Don't light yourself on fire to keep others warm", "The secret of getting ahead is getting started", "When something is important enough, you do it even if the odds are not in your favor",
        "There's a subreddit vent chat, go check it out!", "HEY! YOU, YES YOU, YOU. YOU'RE AMAZING!", "It's only embarrassing if you're embarrassed", "Holding on to anger is like drinking poison and hoping the other person dies",
        "When life shuts a door, open it again, it's a door, that's how they work", "You will meet people that see a lot more in you than you do in yourself", "You are an incredible person", "Work it!", "Those who matter don't mind and those who mind don't matter",
        "You matter", "You matter to us", "Be yourself more", "Show the world who you are, because who you are is an amazing person", "We love you for you", "Keep on swimming", "Good work!", "Treat yourself", "Treat yourself you deserve it", "I like your style",
        "You're perfect just the way you are", "You make people's days", "You're probably smart enough to do a crossword puzzle in pen", "Chill oooouuuuutttt B)", "Square up!", "Pleasure to meet you", "Welcome!", "Woah, impressive",
        "Talk to a trusted family member or friend whenever you get into a pickle", "Your friends probably love you more than you realize, damn", "People who are goodlooking but have terrible personalities are basically real life clickbaits"]
    var item = items[Math.floor(Math.random() * items.length)];
    document.getElementById("help").innerHTML = item;
}

//darkmode
function darkmode() {
    document.body.classList.toggle("dark-mode");
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
    $(document).ready(function() {
        var sch = document.getElementById("searchtable");
        var input = sch.value.toUpperCase();
        if(!input){load(sortpage(n))}
        $(document).bind('keyup',function(e){
            if (e.keyCode == 13) {
                load(search())
            }
        })
    })
}
function search() {
    var sch = document.getElementById("searchtable");
    var input = sch.value.toUpperCase();
    var rowCount = user_data.rows.length;
    if(!input){sortpage(n)}
    //clears currently displayed table
    for (var i = rowCount - 1; i > 1; i--) {
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
function sortpage(n,l) {
    $(document).ready(function () {
        document.getElementById("searchtable").value = ""
        if(page=="data"){disp="This Month"}else if(page=="all-time"){disp="All Time"}else{disp=page}
        if(n==0){srt="total"}else if(n==1){srt="posts"}else if(n==2){srt="comments"}
        document.getElementById("disp-p-s").textContent = disp+" ~ sorted by "+srt
        //different sort methods
        if (n==0){
            //total
            sortable.sort(function(a, b) {return (b[1]+b[2]) - (a[1]+a[2])});}
        else if (n==1){
            //posts
            sortable.sort(function(a, b) {return b[1] - a[1]});
        }
        else if (n==2){
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
        if(l){setTimeout(() => {document.body.classList.add("load");}, 200)}
    })
}

//fetches data on page load or when different data selected
function getpage(page,n,l) {
    $(document).ready(function () {
        w3_close()
        //fetches data from database
        url = "https://isbo-coddit-default-rtdb.firebaseio.com/"+page+".json"
        fetch(url).then(response => {return response.json();}).then(function (data) {
            //stores data in variable
            sortable = [];
            for (var user in data) {
                sortable.push([user, data[user][0], data[user][1]]);
            }
            //calls sort function to display+sort data
            sortpage(n,l)
        });
    });
}