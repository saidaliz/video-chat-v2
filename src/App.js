import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Room from './Room';
import Main from './Main';
import NotFound404 from './NotFound404';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/room/:id' component={Room}/>
        <Route exact path='/' component={Main}/>
        <Route component={NotFound404}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
