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
