const itemsWrapper = document.querySelector(".items");
const menuList = document.querySelectorAll(".selection > header > ul > li > a");
const theme = document.getElementById("theme");
let items = [];
let activeState = "Active";

async function getData() {
  const response = await fetch("../assets/data/data.json");
  items = await response.json();
}

document.addEventListener("DOMContentLoaded", async () => {
  await getData();
  SetData("All");
});

function SetData(type) {
  let newArr = [];

  switch (type) {
    case "All":
    default: {
      newArr = items;
      break;
    }
    case "Active": {
      newArr = items.filter((a) => a.isActive == true);
      break;
    }
    case "Inactive": {
      newArr = items.filter((a) => a.isActive == false);
      break;
    }
  }

  itemsWrapper.innerHTML = "";
  newArr.forEach((elem, indexNo) => {
    const checked = elem.isActive ? "checked" : "";
    itemsWrapper.insertAdjacentHTML(
      "afterbegin",
      ` <article class="item">
          <header>
            <img src="${elem.logo}" alt="${elem.name}" />
            <div class="item__header">
                <h3>${elem.name}</h3>
                <p>
                    ${elem.description}
                </p>
             </div>
          </header>
          <div class="item__actions">
            <button type="button" onClick="RemoveItem(this,'${elem.name}')">Remove</button>
            <label for="${elem.name}">
              <input type="checkbox" onChange="onChange(this)" ${checked} id="${elem.name}" name="${elem.name}" />
              <span></span>
            </label>
           </div>
        </article>
        `
    );
  });
}

function RemoveItem(item, name) {
  const indexNo = items.findIndex((a) => a.name == name);
  if (indexNo > -1) {
    const article = item.closest("article");
    article.classList.add("fadeOut");
    items.splice(indexNo, 1);
    SetData(activeState);
  }
}

if (menuList) {
  menuList.forEach((menu) => {
    menu.addEventListener("click", (e) => {
      e.preventDefault();
      menuList.forEach((elem) => elem.classList.remove("active"));
      e.target.classList.add("active");
      const state = e.target.innerText;
      SetData(state);
      activeState = state;
    });
  });
}

function onChange(item) {
  const title = item.closest("article").querySelector("header h3");
  if (title) {
    const indexNo = items.findIndex((a) => a.name == title.innerText);

    const newItems = [...items];
    newItems[indexNo] = {
      ...newItems[indexNo],
      isActive: item.checked,
    };
    items = newItems;

    if (activeState != "All") {
      setTimeout(() => {
        SetData(activeState);
      }, 500);
    }
  }
}

if (theme) {
  theme.addEventListener("click", () => {
    const span = theme.querySelector("span");
    span.classList.toggle("iconlight");
    document.body.classList.toggle("light");
  });
}
