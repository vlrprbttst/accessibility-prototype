var navHeight = $(".nav").height();
$(".container").css("padding-top", navHeight + 40)

$(".mobile-menu-button").click(function(){
    $(".mobile-menu-panel").addClass("opened")
    $(this).attr('aria-expanded', 'true');
});

$(".close-mobile-menu-button").click(function(){
    $(".mobile-menu-panel").removeClass("opened")
    $(".mobile-menu-button").attr('aria-expanded', 'false');
})
// chi siamo toggle

document.addEventListener('DOMContentLoaded', function() {
    // get the element with id 'chi-siamo'
    var menu = document.getElementById('chi-siamo');
    // get the element with id 'chi-siamo-submenu'
    var submenu = document.getElementById('chi-siamo-submenu');

    // initially hide the submenu
    submenu.style.display = 'none';

    // listen for click event on 'chi-siamo'
    menu.addEventListener('click', function(event) {
        // if submenu is hidden, show it, otherwise hide it
        if (submenu.style.display === 'none') {
            submenu.style.display = 'block';
            menu.setAttribute('aria-expanded', 'true');
        } else {
            submenu.style.display = 'none';
            menu.setAttribute('aria-expanded', 'false');
        }

        // stop the link from opening a URL
        event.preventDefault();
    });
});

// keyboard support


document.addEventListener('DOMContentLoaded', function() {
    var menu = document.getElementById('chi-siamo');
    var submenu = document.getElementById('chi-siamo-submenu');
    var submenuItems = Array.from(submenu.querySelectorAll('[role="menuitem"]'));

    // initially hide the submenu
    submenu.style.display = 'none';

    // listen for keydown event on 'chi-siamo'
    menu.addEventListener('keydown', function(event) {
        if (event.key === "Enter" || event.key === " ") {
            if (submenu.style.display === 'none') {
                submenu.style.display = 'block';
                menu.setAttribute('aria-expanded', 'true');
                // set focus on the first item in the submenu
                submenuItems[0].focus();
            } else {
                submenu.style.display = 'none';
                menu.setAttribute('aria-expanded', 'false');
            }

            event.preventDefault();
        }
    });

    // keyboard navigation for submenu
    submenu.addEventListener('keydown', function(event) {
        var index = submenuItems.indexOf(document.activeElement);

        switch(event.key) {
            case 'ArrowDown':
                var nextElement = submenuItems[(index + 1) % submenuItems.length];
                nextElement.focus();
                event.preventDefault();
                break;
            case 'ArrowUp':
                var prevElement = submenuItems[(index - 1 + submenuItems.length) % submenuItems.length];
                prevElement.focus();
                event.preventDefault();
                break;
            case 'Home':
                submenuItems[0].focus();
                event.preventDefault();
                break;
            case 'End':
                submenuItems[submenuItems.length - 1].focus();
                event.preventDefault();
                break;
            case 'Escape':
                submenu.style.display = 'none';
                menu.setAttribute('aria-expanded', 'false');
                menu.focus();
                event.preventDefault();
                break;
            default:
                if (event.key.length === 1 && event.key.match(/^[0-9a-zA-Z]$/)) {
                    var char = event.key.toLowerCase();
                    for (var i = 0; i < submenuItems.length; i++) {
                        if (submenuItems[i].textContent.trim().toLowerCase().startsWith(char)) {
                            submenuItems[i].focus();
                            break;
                        }
                    }
                    event.preventDefault();
                }
        }
    });
});

//custom select

var selectContainer = document.querySelector('.custom-select-container');
var selectLabel = document.querySelector('#select-label');
var optionsContainer = document.querySelector('.custom-options-container');
var options = Array.prototype.slice.call(document.querySelectorAll('.custom-option'));

var focusedOptionIndex = -1; 

function toggleDropdown() {
    var isExpanded = selectContainer.getAttribute('aria-expanded') === 'true';
    selectContainer.setAttribute('aria-expanded', !isExpanded);
    optionsContainer.style.display = isExpanded ? 'none' : 'block';
    if (!isExpanded) {
        focusedOptionIndex = -1;  
    }
}

selectContainer.addEventListener('click', toggleDropdown);

options.forEach(function(option) {
    option.addEventListener('click', function() {
        selectLabel.textContent = this.textContent;
        options.forEach(function(opt) {
            opt.setAttribute('aria-selected', 'false');
        });
        this.setAttribute('aria-selected', 'true');
    });
});

selectContainer.addEventListener('keydown', function(e) {
    switch (e.code) {
        case 'Space':
        case 'Enter':
            e.preventDefault();
            toggleDropdown();
            if (selectContainer.getAttribute('aria-expanded') === 'true') {
                options[0].focus();
            }
            break;
        case 'ArrowUp':
            e.preventDefault();
            focusedOptionIndex = Math.max(0, focusedOptionIndex - 1);  
            options[focusedOptionIndex].focus();
            break;
        case 'ArrowDown':
            e.preventDefault();
            focusedOptionIndex = Math.min(options.length - 1, focusedOptionIndex + 1);  
            options[focusedOptionIndex].focus();
            break;
        case 'Escape': // Close the dropdown if the ESC key is pressed
            e.preventDefault();
            if (selectContainer.getAttribute('aria-expanded') === 'true') {
                toggleDropdown();
            }
            break;
    }
});

options.forEach(function(option, i) {
    option.addEventListener('keydown', function(e) {
        switch (e.code) {
            case 'Space':
            case 'Enter':
                e.preventDefault();
                this.click();
                selectContainer.focus();
                toggleDropdown();
                break;
            case 'ArrowUp':
                e.preventDefault();
                focusedOptionIndex = Math.max(0, focusedOptionIndex - 1); 
                options[focusedOptionIndex].focus();
                break;
            case 'ArrowDown':
                e.preventDefault();
                focusedOptionIndex = Math.min(options.length - 1, focusedOptionIndex + 1);  
                options[focusedOptionIndex].focus();
                break;
            case 'Escape':  // Close the dropdown if the ESC key is pressed
                e.preventDefault();
                if (selectContainer.getAttribute('aria-expanded') === 'true') {
                    toggleDropdown();
                    selectContainer.focus();
                }
                break;
        }
    });
});

//transcript
document.getElementById("toggleTranscript").addEventListener("click", function() {
    var transcript = document.getElementById("transcript");
    if (transcript.style.display === "none") {
        transcript.style.display = "block";
    } else {
        transcript.style.display = "none";
    }
});


// tabs
const tabs = document.querySelectorAll(".tab");
tabs.forEach((tab) => {
  tab.addEventListener("click", (event) => {
    event.preventDefault();
    const tabpanelId = tab.getAttribute("aria-controls");
    const tabpanel = document.getElementById(tabpanelId);
    const allTabpanels = document.querySelectorAll(".tabpanel");
    allTabpanels.forEach((tp) => tp.classList.remove("active"));
    tabpanel.classList.add("active");
    tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
    tab.setAttribute("aria-selected", "true");
  });
  tab.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      tab.click();
    }
  });
});
