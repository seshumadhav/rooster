// This js expects a file like 'secrets.js' to be present with CLIENT_ID & SCOPES defined.
// For eg, see secrets_sample.js
// Client ID can be retrieved from your project in the Google Developer Console, https://console.developers.google.com

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
    gapi.auth.authorize(
        {
            'client_id': CLIENT_ID,
            'scope': SCOPES.join(' '),
            'immediate': true
        }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        $('#authorize-div').hide();
        authorizeDiv.style.display = 'none';
        $('#stats').show();
        loadCalendarApi();
    } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
        $('#authorize-div').show();
    }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
    gapi.auth.authorize(
        { client_id: CLIENT_ID, scope: SCOPES, immediate: false },
        handleAuthResult);
    return false;
}

/**
 * Load Google Calendar client library. List upcoming events
 * once client library is loaded.
 */
function loadCalendarApi() {
    gapi.client.load('calendar', 'v3', getStatistics);
}

function getStatistics() {
    people = ['asutosh', 'goutham', 'prateek', 'seshu', 'swarnabha'];
    people.forEach(fetchStats);
}

function fetchStats(person) {
    var calendarId = person + '@indeed.com';

    var total_meeting_time_mins = 0;
    var days_delta = Date.now() - Date.parse('2016-01-01T00:00:00+05:30')
    var num_days_in_quarter = Math.floor(days_delta/(1000*60*60*24));

    var request = gapi.client.calendar.events.list({
        'calendarId': calendarId,
        'showDeleted': false,
        'singleEvents': true,
        'orderBy': 'updated',
        'timeMax': (new Date()).toISOString(),
        'timeMin': '2016-01-01T00:00:00+05:30'
    });

    request.execute(function(resp) {
        var calendarIdAsPerResp = resp.summary;
        var blockFor = calendarId.split('@')[0];
        var user = blockFor;

        var blockHeading = 'Summary (' + calendarId + ')';
        addBlock(blockFor, blockHeading);

        var total_meeting_time_mins = 0;
        var events = resp.items;

        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }

                var declined = false;
                if (event.attendees != null) {
                    for (j = 0; j < event.attendees.length; j++) {
                        if (event.attendees[j].email && event.attendees[j].email == calendarId && event.attendees[j].responseStatus == 'declined') {
                            declined = true;
                        }
                    }
                }

                duration = event.end.dateTime - event.start.dateTime;
                sd = Date.parse(event.start.dateTime);
                ed = Date.parse(event.end.dateTime);

                duration2 = (ed - sd)/(1000 * 60);
                if (!isNaN(duration2) && !declined) {
                    total_meeting_time_mins = total_meeting_time_mins + duration2;
                }
            }

            total_meeting_time_hours = Math.floor(total_meeting_time_mins/ 60);
            total_meeting_time_days = Math.floor(total_meeting_time_hours/ 8);
            offset = total_meeting_time_hours - total_meeting_time_days*8;

            weeks = Math.floor(num_days_in_quarter/7);
            weekend_hours = weeks * 16;
            days = num_days_in_quarter - weeks*2;
            hours = (num_days_in_quarter*8) - weekend_hours;
            var percentage = (total_meeting_time_hours*100/hours);
            var percent = parseFloat(percentage).toFixed(2);

            printf('Days in this quarter so far: ' + num_days_in_quarter, user);
            printf('Working days: ' + days, user);
            printf('Total meetings: ' + events.length, user);
            printf('Total time in meetings: '
                + total_meeting_time_mins + 'm => '
                +  total_meeting_time_hours + 'h => '
                + total_meeting_time_days + 'd ' + offset + 'h',
                user);
            printf('Percentage time in meetings: ' + percent + '%', user);
        } else {
            printf('No past events found.', user);
        }});
}

function getCalendarId(person) {
    return person + '@indeed.com';
}

function bodyId(blockFor) {
    return "body-" + blockFor;
}

function headingId(blockFor) {
    return "heading-" + blockFor;
}

function printf(message, blockFor) {
    var $panel = $('#' + blockFor);
    var $body = $panel.find('#' + bodyId(blockFor));

    $('<p>', {
        style: 'white-space: pre-wrap;'
    }).html(message + '\n').appendTo( $body );
}

function addBlock(blockFor, blockHeading) {
    var $template = $(".template");
    var $newPanel = $template.clone().removeClass('template');

    $newPanel.attr("id", blockFor);
    $newPanel.find("#heading").attr("id", headingId(blockFor));
    $newPanel.find("#body").attr("id", bodyId(blockFor));

    $newPanel.find('#' + headingId(blockFor)).text(blockHeading);

    $newPanel.show();
    $('#output').append($newPanel);
}