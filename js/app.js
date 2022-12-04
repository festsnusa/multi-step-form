let page = 1
const plans = {
  "Arcade": 9,
  "Advanced": 12,
  "Pro": 15
}
const addons = {
  "Online storage": 1,
  "Larger storage": 2,
  "Cusomizable profile": 2
}

let validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

let items = document.querySelectorAll('.header__item')
let previous = document.querySelector('.footer__button_previous')
let next = document.querySelector('.footer__button_next')
let footer = document.querySelector('.component__footer')
let monthly = true

let personName
let emailAddress
let phoneNumber

var selectedPlanIndex = 0
var selectedAddons = []

let options
let toggle

let checkboxItems

items[page - 1].classList.add('header__item_active')

previous.addEventListener('click', () => {

  page--
  removeClasses(items, 'header__item_active')
  items[page - 1].classList.add('header__item_active')
  updateComponent()

  if (page == 1) {
    previous.classList.add('footer__button_invisible')
  }

})

next.addEventListener('click', () => {

  if (!pageChecked())
    return

  page++

  if (page <= items.length) {
    removeClasses(items, 'header__item_active')
    items[page - 1].classList.add('header__item_active')
  }

  previous.classList.remove('footer__button_invisible')

  if (page == 4) {
    fillAddons()
  }
  updateComponent()

  if (page > items.length) {
    footer.classList.add('component__footer_invisible')
  }

})

async function updateComponent() {

  const response = await fetch(`./pages/page-${page}.html`);
  const result = await response.text()
  const parser = new DOMParser()
  const DOM = parser.parseFromString(result, "text/html")
  const targetContent = DOM.querySelector("body").innerHTML

  let container = document.querySelector('.component__card')
  container.innerHTML = targetContent

  fillValues()
  checkElements()

}

function removeClasses(elements, className) {
  elements.forEach(e => {
    e.classList.remove(className)
  })
}

function fillValues() {

  if (page == 1) {

    let inputs = document.querySelectorAll('.input__box')
    
    if (personName != null) {
      inputs[0].value = personName
    }
    
    if (emailAddress != null) {
      inputs[1].value = emailAddress
    }
    
    if (phoneNumber != null) {
      inputs[2].value = phoneNumber
    }
  }

  else if (page == 2) {
    console.log(selectedPlanIndex)
    document.querySelectorAll('.options__box')[selectedPlanIndex].classList.add('options__box_active')
  }

  else if (page == 4) {

    let optionTitle = document.querySelector('.cart__option--title')
    optionTitle.innerHTML = Object.keys(plans)[selectedPlanIndex]

    let container = document.querySelector('.cart__addons')
    let text = ''
    let str = (monthly) ? '/mo' : '/yr'
    let sum = Object.values(plans)[selectedPlanIndex]

    if (selectedAddons.length > 0) {
      text += '<hr>'
    }

    selectedAddons.forEach(e => {
      text += '<div class = addons>'
      text += `<div class = addons__title>${e[0]}</div>`
      text += `<div class = addons__price>+${e[1]}${str}</div>`
      text += '</div>'
      sum += e[1]
    })
    container.insertAdjacentHTML('beforeend', text)

    let totalTitle = document.querySelector('.total__title')
    let totalResult = document.querySelector('.total__result')

    totalTitle.innerHTML = `Total (per ${(monthly) ? 'month': 'year'})`
    totalResult.innerHTML = `+$${sum}${str}`
    
    
  }

  if (page == 4) {
    next.innerHTML = 'Confirm'
    next.classList.add('footer__button_blue')
  } else {
    next.innerHTML = 'Next Step'
    next.classList.remove('footer__button_blue')
  }

}

function checkElements() {

  if (page == 2) {

    options = document.querySelectorAll('.options__box')
    let optionValues = document.querySelectorAll('.options__subtitle')
    let bonuses = document.querySelectorAll('.options__bonus')

    options.forEach((e, i) => {
      e.addEventListener('click', () => {
        removeClasses(options, 'options__box_active')
        e.classList.add('options__box_active')
        selectedPlanIndex = i
      })
    })

    toggle = document.querySelector('.toggle__input')
    toggle.addEventListener('click', () => {

      let str = (toggle.checked) ? '/yr' : '/mo'
      monthly = (toggle.checked) ? false : true

      optionValues.forEach((e, i) => {
        e.innerHTML = (toggle.checked) ? `$${Object.values(plans)[i] * 10}${str}` : `$${Object.values(plans)[i]}${str}`
      })

      bonuses.forEach(e => {
        e.classList.toggle('options__bonus_invisible')
      })

    })
  }

  else if (page == 3) {

    checkboxLabels = document.querySelectorAll('.checkbox__label')
    let checkboxItems = document.querySelectorAll('.checkbox__item')
    let prices = document.querySelectorAll('.checkbox__price')

    prices.forEach((price, i) => {
      let str = (monthly) ? '/mo' : '/yr'
      price.innerHTML = (monthly) ? `$${Object.values(addons)[i]}${str}` : `$${Object.values(addons)[i] * 10}${str}`
    })

    checkboxLabels.forEach((checkbox, i) => {
      checkbox.addEventListener('click', () => {
        checkboxItems[i].classList.toggle('checkbox__item_active')
      })
    })

    let inputs = document.querySelectorAll('.checkbox__input')

    inputs.forEach(input => {

      input.addEventListener('click', (ev) => {
        ev.stopPropagation();
        console.log('click input');
      });

    })

  }

}

function fillAddons() {

  let inputs = document.querySelectorAll('.checkbox__input')

  selectedAddons = []

  inputs.forEach((input, i) => {

    if (input.checked) {
      selectedAddons.push(Object.entries(addons)[i])
    }

  })

  console.log(selectedAddons, selectedPlanIndex, monthly)
}

function pageChecked() {

  let allChecked = true

  if (page == 1) {
    let inputs = document.querySelectorAll('.input__box')

    if (inputs[0].value.length == 0) {
      alertField(inputs[0], 0)
      allChecked = false
    } else {
      removeAlertField(inputs[0], 0)
      personName = inputs[0].value
    }

    if (validateEmail(inputs[1].value) == null) {
      alertField(inputs[1], 1)
      allChecked = false
    } else {
      removeAlertField(inputs[1], 1)
      emailAddress = inputs[1].value
    }

    if (inputs[2].value.length < 16) {
      alertField(inputs[2], 2)
      allChecked = false
    } else {
      removeAlertField(inputs[2], 2)
      phoneNumber = inputs[2].value
    }
  }

  return allChecked
}

function alertField(element, i) {

  element.classList.add('input__box_red')

  let subtitle = document.querySelectorAll('.input__subtitle')[i]
  subtitle.classList.add('input__subtitle_active')
}

function removeAlertField(element, i) {

  element.classList.remove('input__box_red')

  let subtitle = document.querySelectorAll('.input__subtitle')[i]
  subtitle.classList.remove('input__subtitle_active')

}