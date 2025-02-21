export const formatWeatherDataDaily = (data) => {
    const dataDaily = []

    const dataEntries = Object.keys(data)
    
    dataEntries.forEach((key, keyIndex )=> {
        for (let i = 0; i< data[key].length; i++){
            if(keyIndex === 0){
                dataDaily.push({});
            }

            const dayValue = data[key][i];
            dataDaily[i][key] = dayValue;
        }
    });

    //date en français
    dataDaily.forEach((data) => {
        const date = new Date(date.time);
        const dayIndex = date.getDay(); //0: dimanche; 1:lundi; 2:mardi; 3:mercredi; 4:jeudi; 5:vendredi; 6:samedi
        data.day = frenchDays[dayIndex];

        return dataDaily;
    });
};

const frenchDays =[ "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];