
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

let preString=""
input.addEventListener('input', ()=>{
    // console.log('input')
    const oldString=input.value.trim()
    if (oldString===preString.trim()){
        return
    }else {
        preString=oldString
    }
    if (oldString===''){
        clearEl(coinsList)
        return
    }
    setTimeout(()=>{
        const newString=input.value.trim()
        if (oldString===newString){
            getCoins(newString).then((coins)=>{
                clearEl(coinsList)
                viewCoins(coins.items)
                // console.log(coins.items)
            })
        }
    },500)
})

function clearEl(el){
    // console.log('clearCoins')
    while (el.firstChild){
        el.firstChild.remove()
    }
}

function getCoins(name){
    // console.log('getCoins')
    return fetch(`https://api.github.com/search/repositories?q=${name}&per_page=5`)
        .then(response=>response.json())
}

function viewCoins(coins){
    if (coins){
        coins.forEach((val,num)=>{
            let newCoin=document.createElement('li')
            newCoin.className='searchBlock__coinItem'

            let newCoinBtn=document.createElement('button')
            newCoinBtn.className='searchBlock__coinBtn'
            newCoinBtn.textContent=`${val.name}`

            // я решл их в атрибуты запихнуть, чтобы было удобней использовать, вроде логично и удобно
            newCoinBtn.setAttribute('data-id',val.id)
            newCoinBtn.setAttribute('data-name',val.name)
            newCoinBtn.setAttribute('data-owner',val.owner.login)
            newCoinBtn.setAttribute('data-stars',val.stargazers_count)

            newCoin.append(newCoinBtn)

            coinsList.append(newCoin)
        })
    }
}
coinsList.onclick=function (e){
    let target=e.target
    if (target.className==='searchBlock__coinBtn' && document.getElementById(target.getAttribute('data-id'))===null){
        saveRepo(
            target.getAttribute('data-id'),
            target.getAttribute('data-name'),
            target.getAttribute('data-owner'),
            target.getAttribute('data-stars')
        )
        input.value=""
        clearEl(coinsList)
    }
}

function saveRepo(id,name,owner,stars){
    let newRepo=document.createElement('li')
    newRepo.className='resultBlock__item repo'
    newRepo.id=id

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