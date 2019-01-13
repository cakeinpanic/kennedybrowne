const GENERATED_CLASS = 'generated';

const LANGUAGES = {
    en1: 'original(english)',
    en2: 'english again',
    es: 'spanish',
    de: 'german',
    ja: 'japanese',
    ru: 'russian',
    fr: 'french'
};

const TRANSLATIONS_ORDER = ['en1', 'es', 'de', 'fr', 'ja', 'ru', 'en2'];

function clearGenerated() {
    $(`.${GENERATED_CLASS}`).remove();
}

function displayTexts(texts, newTranslationOrder) {
    const order = newTranslationOrder || TRANSLATIONS_ORDER;

    const template = document.querySelector('#translations .template-hidden');
    const article = document.querySelector('#translations');
    const popupText = document.querySelector('#animatedModal .popup-text');
    const popupLanguage = document.querySelector('#animatedModal .popup-language');

    order.forEach(addText);
    addText('en1');

    function addText(language) {
        const text = texts[language];
        const element = template.cloneNode(true);
        const textDiv = element.querySelector('.text');
        const languageDiv = element.querySelector('.language');

        $(element).animatedModal({
            animatedIn: 'fadeInUp',
            color: 'white',
            animatedOut: 'fadeOutDown',
        });

        textDiv.innerHTML = text;
        languageDiv.innerHTML = LANGUAGES[language];


        element.classList.add(language);
        element.classList.add(GENERATED_CLASS);

        element.addEventListener('click', function () {
            popupText.innerHTML = text;
            popupLanguage.innerHTML = language;
        });

        element.classList.remove('template-hidden');
        article.appendChild(element)
    }
}
