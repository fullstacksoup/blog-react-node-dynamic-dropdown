import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import DropDownComp from 'components/DropdownComp';

export default function MainRouter(props) {

  return (
      <div>             
          <Switch>
            <Route exact path="/" component={DropDownComp} />                    
          </Switch>               
      </div>
  );
}