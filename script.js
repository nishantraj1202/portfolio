document.addEventListener('DOMContentLoaded', function() {
    var tablinks = document.getElementsByClassName("tab-links");
    var tabcontents = document.getElementsByClassName("tab-contents");

    
    // Define the opentab function globally
    window.opentab = function(tabname) {
        for (let tablink of tablinks) {
            tablink.classList.remove("active-link");
        }
        for (let tabcontent of tabcontents) {
            tabcontent.classList.remove("active-tab");
        }
        event.currentTarget.classList.add("active-link");
        document.getElementById(tabname).classList.add("active-tab");
    };

    var sidemenu = document.getElementById("sidemenu");

    window.openmenu = function() {
        sidemenu.style.right = "0";
    }

    window.closemenu = function() {
        sidemenu.style.right = "-200px";
    }

    const scriptURL = 'https://script.google.com/macros/s/AKfycbyQtvSZK1PVOw5qpCYGsLhKrx3DN0BBbwfBbdYjwMLPWMjRcTebKwftamQ4gAslJB5X/exec';
    const form = document.forms['submit-to-google-sheet'];
    const msg = document.getElementById("msg");

    form.addEventListener('submit', e => {
        e.preventDefault();

        // Client-side validation
        if (!validateForm()) {
            msg.innerHTML = "Invalid input. Please check your entries.";
            return;
        }

        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(response => {
                if (response.ok) {
                    msg.innerHTML = "Message sent successfully";
                    setTimeout(function(){
                        msg.innerHTML = "";
                    }, 5000);
                    form.reset();
                } else {
                    console.error('Error!', response.statusText);
                    msg.innerHTML = "Message failed to send";
                }
            })
            .catch(error => {
                console.error('Error!', error.message);
                msg.innerHTML = "Message failed to send";
            });
    });

    function validateForm() {
        const name = form['Name'].value.trim();
        const email = form['Email'].value.trim();
        const message = form['Message'].value.trim();

        if (!name || !email || !message) {
            return false;
        }

        // Basic email format validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            return false;
        }

        // Sanitize input to prevent XSS
        form['Name'].value = sanitizeInput(name);
        form['Email'].value = sanitizeInput(email);
        form['Message'].value = sanitizeInput(message);

        return true;
    }

    function sanitizeInput(input) {
        const temp = document.createElement('div');
        temp.textContent = input;
        return temp.innerHTML;
    }
});
