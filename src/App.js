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
} from '@material-ui/core'
import { MdExpandLess, MdExpandMore } from 'react-icons/md'
import { makeStyles } from '@material-ui/core/styles'
import { useEffect, useState } from 'react'

const useStyles = makeStyles((theme) => ({
	inputFields: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	formContainer: {
		width: '100%',
		padding: '1rem',
		marginTop: '2rem',
	},
	inputField: {
		width: '75%',
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

const App = () => {
	const classes = useStyles()
	const [tasks, setTasks] = useState([])
	const [selectedIndex, setSelectedIndex] = useState('')

	const handleClick = (index) => {
		if (selectedIndex === index) {
			setSelectedIndex('')
		} else {
			setSelectedIndex(index)
		}
	}

	useEffect(() => {
		setTasks([
			{ id: '1', task: 'Hello world', description: 'yash here' },
			{ id: '2', task: 'Hello world', description: 'yash here' },
		])
	}, [])

	return (
		<div>
			<Container maxWidth='sm'>
				<Paper elevation={2} className={classes.formContainer}>
					<Box className={classes.inputFields}>
						<TextField
							className={classes.inputField}
							label='Task name'
							variant='outlined'
						/>
						<Button type='submit' variant='contained' color='primary'>
							Add Task
						</Button>
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
									<ListItemText primary={item.task} />
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

export default App
