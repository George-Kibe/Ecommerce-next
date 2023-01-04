import React from 'react'
import Card from '../Card/Card'
import "./List.scss"
import useFetch from '../../hooks/useFetch'

const List = ({subCats, maxPrice, sort, catId}) => {

  const {products, loading, error} = useFetch(
    `/products?populate=*&[filters][categories][id]=${catId}${subCats.map(
        (item) => `&[filters][sub_categories][id][$eq]=${item}`
    )}&[filters][price][$lte]=${maxPrice}&sort=price:${sort}`
    );
  
  return (
    <div className='list'>
        {   loading? "Loading" :
            products?.map(item => (
                <Card item={item} key={item.id} />
            ))
        }
    </div>
  )
}

export default List