import React, { Component } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View, Text } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import Database from '../Database';
import Icon from 'react-native-vector-icons/FontAwesome';


const db = new Database();

export default class AlunoScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
          title: 'Lista de Alunos',

          headerRight: (
            <Button

            buttonStyle={{ padding: 20 }}
                        
              onPress={() => { 
                navigation.navigate('AddAluno', {
                  onNavigateBack: this.handleOnNavigateBack
                }); 
              }}

              title="+"
              type="clear"
            />
          ),
        };
    };

    constructor() {
        super();
        this.state = {
          isLoading: true,
          alunos: [],
          notFound: 'Alunos não registrados no sistema.\nClick (+) para adicionar.'
        };
    }

    componentDidMount() {
        this._subscribe = this.props.navigation.addListener('didFocus', () => {
          this.getAlunos();
        });
    }

    getAlunos() {
        let alunos = [];
        db.listAluno().then((data) => {
          alunos = data;
          this.setState({
            alunos,
            isLoading: false,
          });
        }).catch((err) => {
          console.log(err);
          this.setState = {
            isLoading: false
          }
        })
    }

    keyExtractor = (item, index) => index.toString()


    renderItem = ({ item }) => (
    <ListItem
        title={item.Nome}
        onPress={() => {
        this.props.navigation.navigate('AlunoDetails', {
          AlunoId: `${item.AlunoId}`,
        });
        }}
        chevron
        bottomDivider
    />
    )

    render() {
        if(this.state.isLoading){
        return(
            <View style={styles.activity}>
            <ActivityIndicator size="large" color="#0000ff"/>
            </View>
        )
        }
        if(this.state.alunos.length === 0){
        return(
            <View>
            <Text style={styles.message}>{this.state.notFound}</Text>
            </View>
        )
        }
        return (
        <FlatList
            keyExtractor={this.keyExtractor}
            data={this.state.alunos}
            renderItem={this.renderItem}
        />
        );
    }
}

    const styles = StyleSheet.create({
        container: {
        flex: 1,
        paddingBottom: 22
        },
        item: {
        padding: 10,
        fontSize: 18,
        height: 44,
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
        message: {
        padding: 16,
        fontSize: 18,
        color: 'red'
        }
    });
