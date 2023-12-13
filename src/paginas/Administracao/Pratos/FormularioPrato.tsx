import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import http from '../../../http'
import IRestaurante from '../../../interfaces/IRestaurante'
import ITag from '../../../interfaces/ITag'

const FormularioPrato = () => {
  const [nomePrato, setNomePrato] = useState('')
  const [descricao, setDescricao] = useState('')
  const [tags, setTags] = useState<ITag[]>([])
  const [tag, setTag] = useState('')
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])
  const [restaurante, setRestaurante] = useState('')
  const [imagem, setImagem] = useState<File | null>(null)

  useEffect(() => {
    http.get<{ tags: ITag[] }>('tags/').then(res => setTags(res.data.tags))

    http
      .get<IRestaurante[]>('restaurantes/')
      .then(res => setRestaurantes(res.data))
  }, [])

  const selecionarArquivo = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setImagem(event.target.files[0])
      return
    }
    setImagem(null)
  }

  const aoSubmeterForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData()
    formData.append('nome', nomePrato)
    formData.append('descricao', descricao)
    formData.append('tag', tag)
    formData.append('restaurante', restaurante)

    if (imagem) {
      formData.append('imagem', imagem)
    }

    http
      .request({
        url: 'pratos/',
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      })
      .then(() => {
        setNomePrato('')
        setDescricao('')
        setTag('')
        setRestaurante('')
        
        alert('Prato cadastrado com sucesso')
      })
      .catch(err => console.log(err))
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
        Formulário de pratos
      </Typography>
      <Box component='form' sx={{ width: '100%' }} onSubmit={aoSubmeterForm}>
        <TextField
          fullWidth
          value={nomePrato}
          onChange={event => setNomePrato(event.target.value)}
          label='Nome do prato'
          variant='standard'
          required
          margin='dense'
        />
        <TextField
          fullWidth
          value={descricao}
          onChange={event => setDescricao(event.target.value)}
          label='Descrição do prato'
          variant='standard'
          required
        />
        <FormControl margin='dense' fullWidth>
          <InputLabel id='select-tag'>Tag</InputLabel>
          <Select
            labelId='select-tag'
            value={tag}
            onChange={event => setTag(event.target.value)}
          >
            {tags.map(tag => (
              <MenuItem key={tag.id} value={tag.value}>
                {tag.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl margin='dense' fullWidth>
          <InputLabel id='select-restaurante'>Restaurante</InputLabel>
          <Select
            labelId='select-restaurante'
            value={restaurante}
            onChange={event => setRestaurante(event.target.value)}
          >
            {restaurantes.map(restaurante => (
              <MenuItem key={restaurante.id} value={restaurante.id}>
                {restaurante.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <input type='file' onChange={selecionarArquivo} />

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

export default FormularioPrato
