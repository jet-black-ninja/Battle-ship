function createFooter() {
    const footerBox = document.createElement('footer');
    const authorName = document.createElement('p');
    authorName.classList.add('footer-author');
    authorName.textContent = 'Sachin Kumar Singh';
    const footerLink = document.createElement('a');
    footerLink.id='footer-link';
    footerLink.setAttribute('href',"https://github.com/jet-black-ninja/Battle-ship/tree/main");
    const githubLogo = document.createElement('i');
    githubLogo.classList.add("fa-brands","fa-github","fa-xl","footer-logo");
    footerLink.appendChild(githubLogo);

    function getTheme(){
        return localStorage.getItem("theme");
    }

    function toggleDarkTheme(){
    document.querySelector(':root').classList.toggle('dark');
    darkModeButton.classList.toggle("fa-moon");
    darkModeButton.classList.toggle("fa-sun");
    }

    function toggleDarkStorage() {
        if(getTheme() === 'dark')
            localStorage.setItem('theme','light');
        else 
            localStorage.setItem('theme','dark');
    }

    function checkDarkMode() {
        return (
            window.matchMedia && 
        window.matchMedia('(prefers-color-scheme: dark)').matches
    );
    }
    
    const darkModeButton = document.createElement('i');
    darkModeButton.id = 'footer-dark-mode';
    darkModeButton.classList.add("fa-solid","fa-moon","fa-xl");
    darkModeButton.addEventListener('mousedown',function() {
        toggleDarkTheme();
        toggleDarkStorage();
    });

    if(getTheme() === 'dark' || (!getTheme() && checkDarkMode())) {
        toggleDarkTheme();
    }
    footerBox.appendChild(authorName);
    footerBox.appendChild(footerLink);
    footerBox.appendChild(darkModeButton);
    return footerBox;
}

export default createFooter ;