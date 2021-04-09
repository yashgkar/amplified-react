import {
	Container,
	Paper,
	TextField,
	Box,
	Button,
	List,
	Collapse,
	ListItem,
	ListItemText,
	Divider,
	ListItemSecondaryAction,
	IconButton
} from '@material-ui/core'
import { MdDelete, MdExpandLess, MdExpandMore } from 'react-icons/md'
import { makeStyles } from '@material-ui/core/styles'
import { useEffect, useState } from 'react'

import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createTodo, deleteTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'
import awsExports from './aws-exports'
import { withAuthenticator } from '@aws-amplify/ui-react'

Amplify.configure(awsExports)

const useStyles = makeStyles((theme) => ({
	formContainer: {
		width: '100%',
		padding: '1rem',
		marginTop: '2rem',
	},
	inputField: {
		width: '75%',
		marginTop: '2rem',
	},
	listStyling: {
		width: '100%',
		maxWidth: 600,
		backgroundColor: theme.palette.background.paper,
	},
	nested: {
		paddingLeft: theme.spacing(4),
	},
}))

const initialState = { name: '', description: '' }

const App = () => {
	const classes = useStyles()
	const [tasks, setTasks] = useState([])
	const [formState, setFormState] = useState(initialState)
	const [selectedIndex, setSelectedIndex] = useState('')

	const handleClick = (index) => {
		if (selectedIndex === index) {
			setSelectedIndex('')
		} else {
			setSelectedIndex(index)
		}
	}

	useEffect(() => {
		fetchTodos()
	}, [])

	const handleChange = (event) => {
		setFormState({ ...formState, [event.target.name]: event.target.value })
	}

	const fetchTodos = async () => {
		const todo = await API.graphql(graphqlOperation(listTodos))
		setTasks(todo.data.listTodos.items)
	}

	const createTask = async (e) => {
		e.preventDefault()
		try {
			if (formState.description && formState.name) {
				const todo = {
					name: formState.name,
					description: formState.description,
				}
				await API.graphql(graphqlOperation(createTodo, { input: todo }))
				setFormState(initialState)
				fetchTodos()
			}
		} catch (err) {
			console.log(err)
		}
	}

	const deleteTodoById = async (id) => {
		try {
			await API.graphql(graphqlOperation(deleteTodo, { input: { id } }))
			fetchTodos()
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<div>
			<Container maxWidth='sm'>
				<Paper elevation={2} className={classes.formContainer}>
					<Box>
						<form onSubmit={createTask}>
							<TextField
								className={classes.inputField}
								label='Task name'
								variant='outlined'
								value={formState.name}
								onChange={(e) => handleChange(e)}
								name='name'
							/>
							<TextField
								className={classes.inputField}
								label='Description'
								variant='outlined'
								value={formState.description}
								onChange={(e) => handleChange(e)}
								name='description'
							/>
							<Button type='submit' variant='contained' color='primary'>
								Add Task
							</Button>
						</form>
					</Box>
				</Paper>
				<Paper elevation={3} className={classes.formContainer}>
					<List
						component='nav'
						aria-labelledby='nested-list-subheader'
						className={classes.listStyling}
					>
						{(tasks || []).map((item, index) => (
							<div key={index}>
								<ListItem button onClick={() => handleClick(index)}>
									<ListItemText primary={item.name} />
									<ListItemSecondaryAction>
										<IconButton onClick={() => deleteTodoById(item.id)}>
											<MdDelete />
										</IconButton>
									</ListItemSecondaryAction>
									{index === selectedIndex ? (
										<MdExpandLess />
									) : (
										<MdExpandMore />
									)}
								</ListItem>
								<Collapse
									in={index === selectedIndex}
									timeout='auto'
									unmountOnExit
								>
									<List component='div' disablePadding>
										<ListItem button className={classes.nested}>
											<ListItemText primary={item.description} />
										</ListItem>
									</List>
								</Collapse>
								<Divider />
							</div>
						))}
					</List>
				</Paper>
			</Container>
		</div>
	)
}

export default withAuthenticator(App)
