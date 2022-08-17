const defaultDatabase="Database"
const defaultStoreName="defaultStore"
const defaultHistoryName="historyStore"

function createIDB(){
    return (new Promise((resolve,reject)=>{

        var db;

        //打开或新建 Database 数据库；版本号为 1。
        var request = window.indexedDB.open(defaultDatabase,1);

        //数据库打开失败
        request.onerror = function(e){
            reject(e.target.result)
        };

        //数据库打开成功；
        request.onsuccess = function(e){
            resolve(e.target.result);
        };

        //如果数据库不存在就需要创建
        request.onupgradeneeded = function(e){
 
            db = e.target.result;

            //创建仓库；
            var defaultStore = db.createObjectStore(defaultStoreName,{keyPath:"title"});//仓库 1
            var historyStore = db.createObjectStore(defaultHistoryName,{keyPath:"id"});// 仓库 2

            //创建数据库仓库索引；
            defaultStore.createIndex("content","content",{unique:false});
            defaultStore.createIndex("title","title",{unique:true});

            //创建选择记录仓库索引；
            historyStore.createIndex("history","history",{unique:true})
        };
    }))
};

//添加数据
function add(db,storeName,data){
    let request = db.transaction(storeName,"readwrite").objectStore(storeName).add(data);
    request.onsuccess = function(){
        console.log("添加数据成功")
    };
};

//更新历史记录数据
function update(db,storeName,data){
    var request = db.transaction(storeName,"readwrite").objectStore(storeName).put(data);
    request.onsuccess = function(){
        console.log("数据更新成功了")
    }
};

//删除历史记录数据
function deleteItem(db,storeName,keyValue) {
    var request = db.transaction(storeName,"readwrite").objectStore(storeName).delete(keyValue);
    request.onsuccess = function () {
        console.log("数据删除成功")
    }
}

//按索引获取仓库中的单条数据结果
function getValue(db,storeName,indexKey,indexValue){
    return(new Promise((resolve) => {
        var index = db.transaction(storeName).objectStore(storeName).index(indexKey);
        index.get(indexValue).onsuccess = (event) => {
            //结果是一个对象，对象是那条数据结果。
            resolve(event.target.result);
        };
    }))

}

//获取仓库中的所有数据结果
function getAllValue(db,storeName){
    return(new Promise((resolve)=>{
        var objectStore = db.transaction(storeName).objectStore(storeName);
        objectStore.getAll().onsuccess = (event) => {
            //结果是一个数组，数组由多个对象构成。
            resolve(event.target.result);
        };
    }))
}

export {createIDB, add, update, deleteItem, getValue, getAllValue};