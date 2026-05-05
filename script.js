const input = document.getElementById('command-input');
const output = document.getElementById('output');
const email = 'Get in touch: <a href="https://mail.google.com/mail/?view=cm&fs=1&to=usmanmbilkisu@gmail.com" target="_blank">send me an email</a>';
const socialLink = {
    Github: "https://github.com/breezysudo",
    Linkedin: "https://www.linkedin.com/in/breezysudo",
    X: "https://x.com/@breezySudo"
};
const Git = { Github: "https://github.com/breezysudo" };
const github = `Check out my projects on <a href="${Git.Github}" target="_blank">${Git.Github}</a>`
const socials = `
            <br>
    GITHUB: <a href="${socialLink.Github}" target="_blank">${socialLink.Github}</a> <br>
    LINKEDIN: <a href="${socialLink.Linkedin}" target="_blank">${socialLink.Linkedin}</a>  <br>
    X: <a href="${socialLink.X}" target="_blank">${socialLink.X}</a>
`;

input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        const cmd = input.value.trim().toLowerCase();

        if (cmd === 'help'
        ) {
            typeWriter(output, " Available Commands: Press [1][2][3][4][5]", 30);


        } else if (cmd === '1') {
            typeWriter(output, `
     > initializing identity......<br>
     
     alias name ='breezysudo'
     status = 'building'<br>

I don't just learn code.<br>I reverse engineer.<br>

While most people scroll,<br>I debug.<br>

While most people wait,<br>I ship.<br>

Currently sharpening my edge in Javascript and<br>
web systems---building projects that prove<br>
progress, not promises. At the same time,<br>
strengthening communication and employee<br>
support skills because real tech isn't just logic...<br>
it's people. <br><br>

 I treat:<br>

● Bugs as puzzles.<br>
● Errors as feedback.<br>
● Growth as a system.<br>
 
This is foundation mode.<br>
Consistency over noise.<br>
Execution over hype<br>

Version v1.0.0 deployed.<br>
Scaling in progress.<br>
`, 30);



        } else if (cmd === '2') {
            typeWriter(output, email, 40);

        } else if (cmd === '3') {
            typeWriter(output, socials, 40);
        } else if (cmd === '4') {
            typeWriter(output, ' --> HTML5 <br> <br> --> CSS <br><br> --> JAVASCRIPT <br><br> --> SCRATCH.', 40);
        } else if (cmd === '5') {
            typeWriter(output, github, 40);
        }
        else {
            typeWriter(output, 'Unauthorized access is logged', 40);
        }
        input.value = '';



    }
});
function typeWriter(element, html, speed) {
    let i = 0;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    element.innerHTML = "";

    function type() {
        if (i < text.length) {
            element.innerHTML = text.substring(0, i + 1);
            i++;
            const terminalBody = document.getElementById('terminal-body');
            terminalBody.scrollTop = terminalBody.scrollHeight;
            setTimeout(type, speed);
        } else {
            element.innerHTML = html;
        }
    }
    type();
}

