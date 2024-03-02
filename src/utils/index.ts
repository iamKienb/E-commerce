import _ from 'lodash';

const getInfoData = ({filed = [], objects = {} }) =>{
    return _.pick(objects, filed);
}

const getSelectData = (select:string[]) =>{
    return Object.fromEntries(select.map(el => [el ,1]) )
}


const unGetSelectData = (select:string[]) =>{
    return Object.fromEntries(select.map(el => [el ,0]) )
}

export {
    getInfoData,
    getSelectData,
    unGetSelectData
}