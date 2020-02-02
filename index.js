//initilize app when window loads
$(window).on('load', init);

//when app is initialized, get current time of day
function init() {
    $("#currentDay").text(moment().format('dddd,MMMM Do'));

    //retrieve any items already submitted from local storage
    eventActivities = JSON.parse(localStorage.getItem("schedule"));

    console.log(eventActivities);

    //if there are any event activities that have already been submitted, find them
    if (eventActivities != null) {
        for (var i = 0; i < eventActivities.length; i++) {
            find(eventActivities[i]);
        }
    }
    //update scheduler with event activities from loca storage (if any)
    update();
}
//save event activities (to be entered by user) to an empty array
eventActivities = [];
function find(elist) {
    $.each($(".hour"), function (key, h) {
        var value = $(h).text();
        if (elist.date === moment().format('dddd,MMMM Do')) {

            if (value == elist.time) {
                $("#tArea" + key).text(elist.eventDesc);
                return;
            }
        }
    });
}
//update to the current time 
function update() {
    var hour = moment().format("hh a");
    var minute = moment().minutes();
    console.log(hour + "," + minute);
    $.each($(".hour"), function (key, h) {
        var value = $(h).text();

        //set attributes depending upon if calendar block is in the past, present or future according to current time
        if (moment(value, "hh a").isSame(moment(hour, "hh a"))) {
            $("#tArea" + key).css("background-color", "turquoise");
            $("#tArea" + key).attr("disabled", false);
            $("#btn" + key).attr("disabled", false);
        }
        else if (moment(hour, "hh a").isAfter(moment(value, "hh a"))) {
            $("#tArea" + key).addClass("past");
            $("#tArea" + key).attr("disabled", true);
            $("#btn" + key).attr("disabled", true);
        }
        else if (moment(hour, "hh a").isBefore(moment(value, "hh a"))) {
            $("#tArea" + key).addClass("future");
            $("#tArea" + key).attr("disabled", false);
            $("#btn" + key).attr("disabled", false);
        }
    });
}


function storeLocal(event) {
    event.preventDefault();
    //events array will include time, date, and description for each time block
    var events = {
        time: "",
        date: "",
        eventDesc: "",
    };
    
    events.eventDesc = $("textarea#tArea" + id).val();
    events.time = $("label[for='tArea" + id + "']").text();
    events.date = moment().format('dddd,MMMM Do');

    //push any events entered by user to its array in local storage
    function isPresent() {
        console.log("in ispresent");
        eventActivities = JSON.parse(localStorage.getItem("schedule"));
        if (eventActivities == null) {
            if (events.eventDesc !== "") {
                eventActivities = [];
                eventActivities.push(events);
            }

        }
        else {

            for (var i = 0; i < eventActivities.length; i++) {
                if (eventActivities[i].date === events.date) {
                    if (eventActivities[i].time == events.time) {
                        if (events.eventDesc == "") {
                            eventActivities.splice(i, 1);
                        }
                        else {
                            eventActivities[i].eventDesc = events.eventDesc;

                        }
                        return 0;
                    }
                }
            }
            return 1;
        }
    }

    var el = $(this).attr("id");

    var index = el.indexOf("n");
    var id = "";
    for (var i = (index + 1); i < el.length; i++) {
        id += el.charAt(i);
    }
    id = parseInt(id);

    if (isPresent() > 0) {
        if (events.eventDesc !== "") {
            eventActivities.push(events);
        }
        else {
            return;
        }
    }
    //store events in local Storage if any are present
    if (eventActivities.length != 0) {
        localStorage.setItem("schedule", JSON.stringify(eventActivities));
    }
    else {
        localStorage.setItem("schedule", null);
    }

}

//store on button click
$(".btn").on('click', storeLocal); 