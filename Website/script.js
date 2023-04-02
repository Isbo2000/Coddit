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
            load(sortpage(n))
        }
    })
    //define/initialize scroll to top button
    window.onscroll = function() {
        scrollFunction()
    };
    //define/initialize splash text and display table
    $(document).ready(function () {
        pastdata();
        srch = false;
        storetable = [];
        sortable = [];
        page = "This Month";
        n = 0;
        document.getElementById("help").innerHTML = splash[Math.floor(Math.random() * splash.length)];
        getpage(page,n,true);
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

//darkmode
function darkmode() {
    document.body.classList.toggle("dark-mode");
    document.getElementById("theme").textContent == "Light Mode" ? document.getElementById("theme").textContent = "Dark Mode" : document.getElementById("theme").textContent = "Light Mode";
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
        load(sortpage(n))
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
function sortpage(n,l) {
    srch = false;
    $(document).ready(function () {
        document.getElementById("searchtable").value = ""
        if(n==0){srt="total"}else if(n==1){srt="posts"}else if(n==2){srt="comments"}
        document.getElementById("disp-p-s").textContent = page+" ~ sorted by "+srt
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

//loads past data sidebar options
function pastdata() {
    $(document).ready(function () {
        //months
        for (let i = 0; i < months.length; i++) {
            let month = "<li><button id='months' class='tablinks' onclick=load(getpage(page='";
            month += months[i].name.replace(" ","");
            month += "',n));>";
            month += months[i].name;
            month += "<i style='color:grey;float:right;margin-right:1px' class='bi bi-info-circle' data-bs-toggle='tooltip' data-bs-placement='right' title='";
            month += (months[i].tooltip ? months[i].tooltip : `Data from ${months[i].name}`);
            month += "'></i></button></li>";
            $('#olderMonths').append(month);
        }

        //years
        for (let i = 0; i < years.length; i++) {
            let year = "<li><button id='months' class='tablinks' onclick=load(getpage(page='";
            year += years[i].name;
            year += "',n));>";
            year += years[i].name;
            year += "<i style='color:grey;float:right;margin-right:1px' class='bi bi-info-circle' data-bs-toggle='tooltip' data-bs-placement='right' title='";
            year += (years[i].tooltip ? years[i].tooltip : `Data from ${years[i].name}`);
            year += "'></i></button></li>";
            $('#olderYears').append(year);
        }

        //credits
        for (let i = 0; i < credits.length; i++) {
            let credit = "<li><a id='credit' class='tablinks' href='";
            credit += credits[i].url;
            credit += "' style='text-decoration: none;'>";
            credit += credits[i].name;
            credit += "<i style='color:grey;float:right;margin-right:1px' class='bi bi-info-circle' data-bs-toggle='tooltip' data-bs-placement='right' title='";
            credit += credits[i].tooltip;
            credit += "'></i></a></li>";
            $('#creditlist').append(credit);
        }
    });
}