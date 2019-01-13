// Enter an API key from the Google API Console:
//   https://console.developers.google.com/apis/credentials
const apiKey = 'AIzaSyC9ZrS7U2d9aX4dSf2PL1pPCmxZNtcLnlk';

const OWN_ORDER = [...TRANSLATIONS_ORDER];
OWN_ORDER.shift();

const sourceText = $('#sourceText');
const loader = $('#loader');
const SAMPLE = {
    'en1': 'Input any text to see metamorphosis',
    'es': 'Ingrese cualquier texto para ver la metamorfosis.',
    'de': 'Geben Sie einen beliebigen Text ein, um die Metamorphose anzuzeigen.',
    'fr': 'Entrez n&#39;importe quel texte pour afficher la métamorphose.',
    'ja': 'nを入力',
    'ru': 'Введите n',
    'en2': 'Enter n'
};

function translate(data) {
    if (!data.textToTranslate) {
        return Promise.resolve('');
    }

    let url = 'https://www.googleapis.com/language/translate/v2/';
    url += '?key=' + apiKey;

    url += '&target=' + data.targetLang;
    url += '&source=' + data.sourceLang;

    url += '&q=' + encodeURI(data.textToTranslate);

    // Return response from API
    return $.ajax({
        url: url,
        type: 'GET',
        data: data ? JSON.stringify(data) : '',
        dataType: 'json',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    });
}

// function translate(t) {
//     return new Promise((resolve)=>{
//         setTimeout(()=>{
//             resolve({data: {translations: [{translatedText: 666 + t.textToTranslate}]}})
//         }, 100)
//     });
// }

function getLanguageForApi(i) {
    const l = TRANSLATIONS_ORDER[i];
    if (l === 'en1' || l === 'en2') {
        return 'en'
    }
    return l;
}


function handleAnyText(startText) {
    const texts = [startText];
    let i = 1;

    return translateOne({
        textToTranslate: startText,
        targetLang: getLanguageForApi(i),
        sourceLang: getLanguageForApi(i - 1)
    });

    function translateOne(data) {
        return translate(data).then((a) => {
            texts.push(a.data.translations[0].translatedText);

            if (++i < TRANSLATIONS_ORDER.length) {
                const data1 = {
                    textToTranslate: texts[i - 1],
                    targetLang: getLanguageForApi(i),
                    sourceLang: getLanguageForApi(i - 1)
                };
                return translateOne(data1);
            }

            return texts;
        })
    }
}

function handleText() {
    loader.show();
    clearGenerated();
    const text = sourceText.html();
    text.length = text.length < 51 ? text.length : 50;
    handleAnyText(text).then(a => {
        const withLanguageMarks = a.reduce((k, b, i) => {
            return {...k, ...{[TRANSLATIONS_ORDER[i]]: b}}
        }, {});
        console.log(JSON.stringify(withLanguageMarks));
        loader.hide();
        displayTexts(withLanguageMarks, OWN_ORDER);
    });
}

sourceText.on('input', $.debounce(1000, handleText));
loader.hide();
displayTexts(SAMPLE, OWN_ORDER);