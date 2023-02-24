import {
  collection,
  query,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  increment,
  orderBy,
  serverTimestamp,
  Timestamp,
  getDocsFromServer,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

const handleEdit = async (collectionName, id, data) => {
  await updateDoc(doc(db, collectionName, id), data);
};

const getChallans = async(q) => {
  try{
    let challanArr = await new Promise((resolve, reject) => {
      let filterArray = [];
      getDocsFromServer(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // console.log(doc.data(), 'getchallan')
          var docData = doc.data();
            var internalObjs =  docData.dataList
            internalObjs.forEach(function(item, i) {
              var qualityName = item.name;
              if(qualityName == "") return;
              var valueName = item.value;
              var valueType = item.type;
              var num_of_taka = item.num;
              filterArray.push({
                indexValue: i,
                name: docData.id,
                challanDateTime: docData.challanDateTime,
                challanNo: docData.challanNo,
                date: normalDateFormat(docData.challanDateTime),
                type: docData.type,
                dying: docData.dying,
                taka_quality: qualityName,
                dataValue: valueName,
                qualityType : valueType,
                color: valueType == "color" ? valueName : "",
                design: valueType == "design" ? valueName : "",
                chartwise: valueType == "chartwise" ? valueName : "",
                num_of_taka
              });
            })
        });
        resolve(filterArray);
      });
    });
    return challanArr;
  } catch (error) {
    console.error(error);
  }
};

const getAllQualities = async () => {
  try {
    var allQualities = query(collection(db, "Quality"),orderBy("__name__"));
    let qualityArray = await new Promise((resolve, reject) => {
      onSnapshot(allQualities, (querySnapshot) => {
        let qualityArray = [];
        querySnapshot.forEach((doc) => {
          var name = (doc.data().name)? doc.data().name : doc.id;
          qualityArray.push({ ...doc.data(), name: name, id:doc.id });
        });
        resolve(qualityArray);
      });
    });
    return qualityArray;
  } catch (error) {
    console.error(error);
  }
};

const dateFormat = (date) => {
  var dateVal = new Date(date);
  return dateVal.getTime();
};

const normalDateFormat = (timestamp) => {
  let date = new Date(timestamp);
  let year = date.getFullYear();
  let month = (date.getMonth()+1).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");
  let normalDate = day+"-"+month+"-"+year;
  return normalDate;
};

const getValueFormatDate = (timestamp) => {
  let date = new Date(timestamp);
  let year = date.getFullYear();
  let month = (date.getMonth()+1).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");
  let normalDate =year+"-"+month+"-"+day;
  return normalDate;
};

const getMonthDayYear = (timestamp) => {
  let date = new Date(timestamp);
  let year = date.getFullYear();
  let month = (date.getMonth()+1).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");
  let normalDate =month+"-"+day+"-"+year;
  return normalDate;
};

const getFinalTime = (dateVal) => {
  let date = new Date(dateVal);
  let dateFormated = getValueFormatDate(date.getTime())
  return new Date(dateFormated).getTime()
}

function sumArray(array) {
  let sum = 0; 
  array.forEach(item => {sum += item;});
  return sum;
}

export {
  handleEdit,
  getAllQualities,
  dateFormat, getFinalTime,
  normalDateFormat, getValueFormatDate, sumArray,getChallans,getMonthDayYear
};
