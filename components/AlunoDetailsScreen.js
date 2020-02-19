import React, { Component } from 'react';
import { ScrollView, StyleSheet, Image, ActivityIndicator, View, Text } from 'react-native';
import { Card, Button } from 'react-native-elements';
import Database from '../Database';

const db = new Database();

export default class AlunoDetailsScreen extends Component {
  static navigationOptions = {
    title: 'Detalhes de Aluno',
  };

  constructor() {
    super();
    this.state = {
      isLoading: true,
      aluno: {},
      id: '',
    };
  }

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      const { navigation } = this.props;
      //alert (navigation.getParam('AlunoId'));
      db.alunoById(navigation.getParam('AlunoId')).then((data) => {
        console.log(data);
        aluno = data;
        this.setState({
          aluno,
          isLoading: false,
          id: aluno.AlunoId
        });
      }).catch((err) => {
        console.log(err);
        this.setState = {
          isLoading: false
        }
      })
    });
  }

  deleteAluno(id) {
    const { navigation } = this.props;
    this.setState({
      isLoading: true
    });
    db.deleteAluno(id).then((result) => {
      console.log(result);
      this.props.navigation.goBack();
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }
    return (
      <ScrollView>
        <Card style={styles.container}>
          <View style={styles.subContainer}>
            <View>
              <Text style={{fontSize: 16}}>ID: {this.state.aluno.AlunoId} </Text>
            </View>
            <View>
              <Text style={{fontSize: 16}}>Nome: {this.state.aluno.Nome}</Text>
            </View>
          </View>
          <View style={styles.detailButton}>
            <Button
              large
              backgroundColor={'#CCCCCC'}
              leftIcon={{name: 'edit'}}
              title='Editar'
              onPress={() => {
                this.props.navigation.navigate('EditAluno', {
                  AlunoId: `${this.state.id}`,
                });
              }} />
          </View>
          <View style={styles.detailButton}>
            <Button
              large
              backgroundColor={'#999999'}
              color={'#FFFFFF'}
              leftIcon={{name: 'excluir'}}
              title='Excluir'
              onPress={() => this.deleteAluno(this.state.id)} />
          </View>
        </Card>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  subContainer: {
    flex: 1,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#CCCCCC',
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  detailButton: {
    marginTop: 10
  }
})
