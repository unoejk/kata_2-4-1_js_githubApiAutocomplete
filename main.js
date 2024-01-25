
// ---------------- go-go

// document.querySelector('.test').addEventListener('click',(e)=>{
//     console.log('hi')
// })

document.querySelector('.searchBlock').addEventListener('submit',(e)=>{e.preventDefault()})

const input=document.querySelector('.searchBlock__input')
const coinsList=document.querySelector('.searchBlock__coinsList')
const reposList=document.querySelector('.resultBlock')

input.value=""
input.focus()

// ---------------- searching input

let preString=""
input.addEventListener('input', ()=>{
    const oldString=input.value.trim()
    if (oldString===preString.trim()){
        return
    }else {
        preString=oldString
    }
    if (oldString===''){
        clearCoinsList()
        return
    }
    setTimeout(()=>{
        const newString=input.value.trim()
        if (oldString===newString){
            getCoins(newString)
                .then(coins=>{
                    clearCoinsList()
                    viewCoins(coins.items)
                })
                .catch(err=>{
                    console.log(err)
                    alert('Не получилось получить список, ошибка в консоли')
                })
        }
    },500)
})

function clearCoinsList(){
    while (coinsList.firstElementChild!==null){
        coinsList.firstElementChild.remove()
    }
    activeCoinsArray=[]
}

function getCoins(name){
    return Promise.resolve().then(()=>{
        return fetch(`https://api.github.com/search/repositories?q=${name}&per_page=5`).then(
            response=>response.json()
        )
    })
}

// ---------------- add coins from search

let activeCoinsArray=[]
function viewCoins(coins){
    if (coins){
        coins.forEach((val,num)=>{
            activeCoinsArray.push(val)

            let newCoin=document.createElement('li')
            newCoin.className='searchBlock__coinItem'

            let newCoinBtn=document.createElement('button')
            newCoinBtn.className='searchBlock__coinBtn'
            newCoinBtn.textContent=`${val.name}`

            newCoin.append(newCoinBtn)

            coinsList.append(newCoin)
        })
    }
}
coinsList.onclick=function (e){
    let target=e.target
    if (target.className==='searchBlock__coinBtn'){
        target=target.parentElement
    }
    if (target.className==='searchBlock__coinItem'){
        let counter=0
        while (target.previousElementSibling!==null){
            counter++
            target=target.previousElementSibling
        }
        saveRepo(
            activeCoinsArray[counter].name,
            activeCoinsArray[counter].owner.login,
            activeCoinsArray[counter].stargazers_count
        )
        input.value=""
        clearCoinsList()
    }
}

// ---------------- add repositories from coins

function saveRepo(name,owner,stars){
    let newRepo=document.createElement('li')
    newRepo.className='resultBlock__item repo'

    let newRepoContent=document.createElement('div')
    newRepoContent.className='repo__content'

    let newRepoName=document.createElement('span')
    newRepoName.className='repo__text'
    newRepoName.textContent=`Name: ${name}`

    let newRepoOwner=document.createElement('span')
    newRepoOwner.className='repo__text'
    newRepoOwner.textContent=`Owner: ${owner}`

    let newRepoStars=document.createElement('span')
    newRepoStars.className='repo__text'
    newRepoStars.textContent=`Stars: ${stars}`

    let newRepoClose=document.createElement('button')
    newRepoClose.className='repo__closeBtn'

    newRepoContent.append(newRepoName)
    newRepoContent.append(newRepoOwner)
    newRepoContent.append(newRepoStars)

    newRepo.append(newRepoContent)
    newRepo.append(newRepoClose)

    reposList.append(newRepo)
}
reposList.onclick=function (e){
    let target=e.target
    if (target.className==='repo__closeBtn'){
        target.parentElement.remove()
    }
}