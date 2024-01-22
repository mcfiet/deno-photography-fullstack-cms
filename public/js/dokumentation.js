const codeblocks = document.querySelectorAll("code");
//console.log(codeblocks);

for (let k = 0; k < codeblocks.length; k++) {
  const lines = codeblocks.item(k).innerHTML.split("\n");

  for (let i = 1; i < lines.length; i++) {
    const firstWord = lines[i].split("//")[1];

    const newString = codeblocks
      .item(k)
      .innerHTML.replace(
        "//" + firstWord,
        `<span class="comment">//${firstWord}</span>`
      );
    codeblocks.item(k).innerHTML = newString;
  }
}

// Überschriften und den doku-wrapper aus dem Dokument auslesen
const h2 = document.querySelectorAll("h2");
const wrapper = document.querySelector(".doku-wrapper");

// Liste initialisieren und am Anfang vom Wrapper einfügen
const ul = document.createElement("ul");
wrapper.insertBefore(ul, wrapper.firstChild);

// Überschrift "Inhaltsverzeichnis" initialisieren und am Anfang vom Wrapper einfügen
const heading = document.createElement("h2");
heading.innerHTML = "Inhaltsverzeichnis";
wrapper.insertBefore(heading, wrapper.firstChild);
let counter = 0;

// Für jede ausgelesene Überschrift ein Listenelement
// mit Link auf die vergebene, durchnummerierte Id setzen.

h2.forEach((element) => {
  if (counter > 0) {
    // Die Überschrift bekommt die Link-Id vergeben
    element.setAttribute("id", counter);

    // Listenelement und Link werden generiert
    const li = document.createElement("li");
    const a = document.createElement("a");

    // Link bekommt das Link-Attribut auf die entsprechende Überschrift
    a.setAttribute("href", "#" + counter);

    // Linktext ist die Überschrift
    a.innerHTML = element.innerHTML;

    // Link wird an das Listenelement gebunden
    // und das Listenelement an die Liste
    li.appendChild(a);
    ul.appendChild(li);
  }
  counter++;
});
