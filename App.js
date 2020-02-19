import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AlunoScreen from './components/AlunoScreen';
import AlunoDetailsScreen from './components/AlunoDetailsScreen';
import AlunoAddScreen from './components/AlunoAddScreen';
import AlunoEditScreen from './components/AlunoEditScreen';

const RootStack = createStackNavigator(
  {
    Aluno: AlunoScreen,
    AlunoDetails: AlunoDetailsScreen,
    AddAluno: AlunoAddScreen,
    EditAluno: AlunoEditScreen,
  },
  {
    initialRouteName: 'Aluno',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#777777',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  },
);

const RootContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <RootContainer />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});