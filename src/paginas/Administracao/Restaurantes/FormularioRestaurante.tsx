import { Box, Button, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import http from '../../../http'
import IRestaurante from '../../../interfaces/IRestaurante'

const FormularioRestaurante = () => {
  const parametros = useParams()

  useEffect(() => {
    if (parametros.id) {
      http
        .get<IRestaurante>(`restaurantes/${parametros.id}/`)
        .then(res => setNomeRestaurante(res.data.nome))
    }
  }, [parametros])

  const [nomeRestaurante, setNomeRestaurante] = useState('')

  const aoSubmeterForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (parametros.id) {
      http
        .put(`restaurantes/${parametros.id}/`, {
          nome: nomeRestaurante,
        })
        .then(() => alert('Restaurante atualizado com sucesso!'))

      return
    }

    http
      .post('restaurantes/', {
        nome: nomeRestaurante,
      })
      .then(() => alert('Restaurante cadastrado com sucesso!'))
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexGrow: 1,
      }}
    >
      <Typography component='h1' variant='h6'>
        Formulário de restaurantes
      </Typography>
      <Box component='form' sx={{ width: '100%' }} onSubmit={aoSubmeterForm}>
        <TextField
          fullWidth
          value={nomeRestaurante}
          onChange={event => setNomeRestaurante(event.target.value)}
          label='Nome do restaurante'
          variant='standard'
          required
        />
        <Button
          sx={{ marginTop: 1 }}
          fullWidth
          type='submit'
          variant='outlined'
        >
          Salvar
        </Button>
      </Box>
    </Box>
  )
}

export default FormularioRestaurante
