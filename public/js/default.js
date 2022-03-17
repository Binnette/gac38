/* Theme functions */
function externalLinks() {
    for (
        var c = document.getElementsByTagName("a"), a = 0;
        a < c.length;
        a++
    ) {
        var b = c[a];
        b.getAttribute("href") &&
            b.hostname !== location.hostname &&
            (b.target = "_blank") &&
            (b.rel = "noopener");
    }
}
externalLinks();

// Get the theme toggle input
const themeToggle = document.querySelector('.theme-switch input[type="checkbox"]');

// Get the current theme from local storage
const currentTheme = localStorage.getItem("theme");

// If the current local storage item can be found
if (currentTheme) {
    // Set the body data-theme attribute to match the local storage item
    document.documentElement.setAttribute("data-theme", currentTheme);

    // If the current theme is dark, check the theme toggle
    if (currentTheme === "dark") {
        themeToggle.checked = true;
    }
}

// Function that will switch the theme based on the if the theme toggle is checked or not
function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
    }
}

// Add an event listener to the theme toggle, which will switch the theme
themeToggle.addEventListener("change", switchTheme, false);

/* Custom function */

// Function on radio-icon clicked
function changeIcon() {
    var other = $('#radio-icon-other-value');
    var checked = $('input[name="radio-icon"]:checked').val();
    if (checked === 'option-other') {
        other.removeAttr('disabled');
    } else {
        other.attr('disabled', 'disabled');
    }
}

changeIcon();

// return selected icon
function getIcon() {
    var other = $('#radio-icon-other-value').val().trim();
    var checked = $('input[name="radio-icon"]:checked').val();
    if (checked === 'option-other') {
        return other;
    } else {
        return checked;
    }
}

// Post event to API
function postEvent() {
    var button = $("#btn-post-event");
    button.attr('disabled', 'disabled');
    var result = $("#result");
    result.text('🔄 Work in progress');

    var icon = getIcon();
    var title = document.querySelector('#title').value.trim();
    var date = document.querySelector('#date').value;
    var time = document.querySelector('#time').value.trim();
    var location = document.querySelector('#location').value.trim();
    var username = document.querySelector('#username').value.trim();
    var description = document.querySelector('#description').value.trim();

    if (!title || title.length < 4) {
        button.removeAttr('disabled');
        return result.text("❌ Title is mandatory");
    }

    if (!date || date.length < 10) {
        button.removeAttr('disabled');
        return result.text("❌ Date is mandatory");
    }

    if (!time || time.length < 3) {
        button.removeAttr('disabled');
        return result.text("❌ Time is mandatory");
    }

    var regTime = '^[0-9]{1,2}(?:\:[0-5][0-9]){0,1}[a|p]m$';
    if (!time.match(regTime)) {
        button.removeAttr('disabled');
        return result.text("❌ Time must match 10am, 8pm, 1:30pm, ...");
    }

    if (!location || location.length < 3) {
        button.removeAttr('disabled');
        return result.text("❌ Location is mandatory");
    }

    if (!username || location.username < 3) {
        button.removeAttr('disabled');
        return result.text("❌ Your name is mandatory");
    }

    var toPost = {
        'icon': icon,
        'title': title,
        'date': date,
        'time': time,
        'location': location,
        'username': username,
        'description': description,
    };

    var url = '/event';

    $.post(url, toPost)
        .done(function (data) {
            $('#form-post-event').trigger("reset");
            if (data && data.responseJSON && data.responseJSON.status) {
                var status = data.responseJSON.status;
                return result.text(status);
            } else {
                return result.text("✔ Event posted");
            }
        })
        .fail(function (data) {
            if (data && data.responseJSON) {
                if (data.responseJSON.reason) {
                    console.log('Error reason: ' + data.responseJSON.reason);
                }
                if (data.responseJSON.error) {
                    return result.text(data.responseJSON.error);
                }
            }
            return result.text("❌ Unexpected error");
        })
        .always(function () {
            button.removeAttr('disabled');
        });

}