import { ChangeEvent, useState } from 'react'

export function useSignUp() {
  // states separados porque a função onChange deles são diferentes
  const [valueNumbers, setvalueNumbers] = useState({
    document: '',
    addressNumber: '',
  })
  const [values, setValues] = useState({
    name: '',
    address: '',
    neighborhood: '',
  })

  function handleChangeNumbers(ev: ChangeEvent<HTMLInputElement>) {
    setvalueNumbers({
      ...valueNumbers,
      [ev.target.name]: ev.target.value.replace(/[^\d]/g, ''),
    })
  }

  function handleChange(ev: ChangeEvent<HTMLInputElement>) {
    setValues({
      ...values,
      [ev.target.name]: ev.target.value,
    })
  }

  return {
    values,
    valueNumbers,
    handleChange,
    handleChangeNumbers,
  }
}
