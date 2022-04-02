function start() {
    $(document).ready(function () {
        page = "data";
        n = 0;
        getpage(page,n)
    });
    splashtext();
}

function splashtext() {
    var items = ["Take breaks!", "Developed by Dimittrikov and Daniel_R013 (and me hehe)", "It's important to stay independent", "Remember to breathe", "In through the nose and out through the mouth",
        "Call your local crisis line when things get especially sticky", "We love having you around", "You're worthy", "A break from reddit every so often is always helpful!", "Stay true to you!",
        "Be you", "You look wonderful! You should show everyone sometime", "Keep it up", "r/teenagersbutpog, since April 2021", "Woah, quite the reddit usage there!", "Impressive",
        "All things are difficult before they are easy", "Don't light yourself on fire to keep others warm", "The secret of getting ahead is getting started", "When something is important enough, you do it even if the odds are not in your favor",
        "There's a subreddit vent chat, go check it out!", "HEY! YOU, YES YOU, YOU. YOU'RE AMAZING!", "It's only embarrassing if you're embarrassed", "Holding on to anger is like drinking poison and hoping the other person dies",
        "When life shuts a door, open it again, it's a door, that's how they work", "You will meet people that see a lot more in you than you do in yourself", "You are an incredible person", "Work it!", "Those who matter don't mind and those who mind don't matter",
        "You matter", "You matter to us", "Be yourself more", "Show the world who you are, because who you are is an amazing person", "We love you for you", "Keep on swimming", "Good work!", "Treat yourself", "Treat yourself you deserve it", "I like your style",
        "You’re perfect just the way you are", "You make people's days", "You're probably smart enough to do a crossword puzzle in pen", "Chill oooouuuuutttt B)", "Square up!", "Pleasure to meet you", "Welcome!", "Woah, impressive",
        "Talk to a trusted family member or friend whenever you get into a pickle", "Your friends probably love you more than you realize, damn", "People who are goodlooking but have terrible personalities are basically real life clickbaits"]
    var item = items[Math.floor(Math.random() * items.length)];
    document.getElementById("help").innerHTML = item;
}

function darkmode() {
    document.body.classList.toggle("dark-mode");
}

function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("mySidebar").style.width = "65%";
    document.getElementById("main").style.opacity = "0.6";
}

function w3_close() {
    document.getElementById("main").style.opacity = "1";
    document.getElementById("mySidebar").style.display = "none";
}

function getpage(page,n,s) {
    document.body.classList.add("load");
    $(document).ready(function () {
        url = "https://isbo-coddit-default-rtdb.firebaseio.com/"+page+".json"
        fetch(url).then(response => {return response.json();}).then(function (data) {
            if(page=="data"){disp="This Month"}else if(page=="all-time"){disp="All Time"}else{disp=page}
            if(n==0){srt="total"}else if(n==1){srt="posts"}else if(n==2){srt="comments"}
            document.getElementById("disp-p-s").textContent = disp+" ~ sorted by "+srt
            var sortable = [];
            for (var user in data) {
                sortable.push([user, data[user][0], data[user][1]]);
            }
            if (n==0){
                sortable.sort(function(a, b) {return (b[1]+b[2]) - (a[1]+a[2])});}
            else if (n==1){
                sortable.sort(function(a, b) {return b[1] - a[1]});
            }
            else if (n==2){
                sortable.sort(function(a, b) {return b[2] - a[2]});
            }
            var rowCount = user_data.rows.length;
            for (var i = rowCount - 1; i > 1; i--) {
                user_data.deleteRow(i);
            }
            var storetable = []
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
            if (s) {
                var sch = document.getElementById("searchtable");
                var input = sch.value.toUpperCase();
                var stbl = []
                for (var i = 0; i < storetable.length; i++) {
                    var name = storetable[i].split('</td><td><a href= https://reddit.com/user/').pop().split('</a></td><td>')[0].split('>').pop()
                    if (name.toUpperCase().indexOf(input) > -1) {
                        stbl.push(storetable[i])
                    }
                }
                storetable = stbl
            } else {
                document.getElementById("searchtable").value = ""
            }
            if (storetable.length > 1000) {
                var stlen = 1000
            } else {
                var stlen = storetable.length
            }
            for (var i = 0; i < stlen; i++) {
                $('#user_data').append(storetable[i]);
            }
            setTimeout(() => {document.body.classList.remove("load");}, 500)
        });
    });
}