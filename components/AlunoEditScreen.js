import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, TextInput,Picker, Text } from 'react-native';
import { Button } from 'react-native-elements';
import Database from '../Database';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-datepicker'
import cep from 'cep-promise'
import { validate as validateCPF } from 'gerador-validador-cpf'
import { format as formatCPF } from 'gerador-validador-cpf'
import { TextInputMask } from 'react-native-masked-text'
import { estados } from '../components/JSONCidades'

const db = new Database();

export default class AlunoAEditScreen extends Component {
  static navigationOptions = {
    title: 'Editar dados de aluno',
  };

  constructor() {
    super();
    this.state = {
      AlunoId:'',
      AlunoNome:'',
      date:'',
      SerieIngresso:'',
      cep:'',
      valcep:'',
      valor:'',
      Rua:'',
      NumeroRes:'',
      Complemento:'',
      Bairro:'',
      Cidade:'',
      Estado:'',
      NomeMae:'',
      CPFMae:'',
      datamens:'',
      isLoading: true,

      uf: '', 
      cidade: '', 
      selectedValueCidade: '', 
      data: []
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    db.alunoById(navigation.getParam('AlunoId')).then((data) => {
      console.log(data);
      const aluno = data;

      this.setState({
        AlunoId: aluno.AlunoId,
        AlunoNome: aluno.Nome,
        date: aluno.DataNasc,
        SerieIngresso: aluno.SerieIngresso,
        cep: aluno.CEP,
        Rua: aluno.Rua,
        NumeroRes: aluno.NumeroRes,
        Complemento: aluno.Complemento,
        Bairro: aluno.Bairro,
        Cidade: aluno.Cidade,
        cidade: aluno.Cidade,
        pickerValue: aluno.Cidade,
        Estado: aluno.Estado,
        uf:aluno.Estado,
        NomeMae: aluno.NomeMae,
        CPFMae: aluno.CPFMae,
        datamens: aluno.DataMens,
        isLoading: false,
      });
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }

  _getItem = (val) => {

    estados.map(element => {
        if (val == element.sigla) {
            //console.warn(element.cidades);
            this.state.data=element.cidades;
            return  element.cidades
        }
    })
  }

  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  _onChageValue = (value) => {
    this.setState({ uf: value })
  }

  _onChageValue2 = (value) => {
    this.setState({cidade: value})
     //console.warn(value)
  }


  updateAluno() {
    this.setState({
      isLoading: true,
    });

    if (this.state.uf=='' || this.state.uf=='Estado'){
      alert ("Estado não especificado.");
      this.setState({
        isLoading: false,
      })
      return;
    }else{
      this.state.Estado=this.state.uf;
    }

    if (this.state.Cidade==''){
      alert ("Cidade não especificada.");
      this.setState({
        isLoading: false,
      })
      return;
    }

    if (this.state.AlunoNome==''){
      alert ("Nome do aluno inválido. Digite um nome válido.");
      this.setState({
        isLoading: false,
      })
      return;
    }

    if (this.state.date==''){
      alert ("Data de Nascimento inválida. Selecione uma data válida.");
      this.setState({
        isLoading: false,
      })
      return;
    }

    if (this.state.SerieIngresso==null || this.state.SerieIngresso=='Escolha uma série' ){
      alert ("Série de ingresso não selecionada.");
      this.setState({
        isLoading: false,
      })
      return;
    }

    var er = /^[0-9]+$/;
    if (!er.test(this.state.NumeroRes)){
      alert ("Número residencial inválido. Digite um número válido.");
      this.setState({
        isLoading: false,
      })
      return;
    }

    if (this.state.Estado==''){
      alert ("Estado não especificado.");
      this.setState({
        isLoading: false,
      })
      return;
    }

    if (this.state.Cidade==''){
      alert ("Cidade não especificada.");
      this.setState({
        isLoading: false,
      })
      return;
    }

    if (this.state.Bairro==''){
      alert ("Bairro não especificado.");
      this.setState({
        isLoading: false,
      })
      return;
    }

    if (this.state.Rua==''){
      alert ("Rua do endereço não especificado.");
      this.setState({
        isLoading: false,
      })
      return;
    }

    if (this.state.NomeMae==''){
      alert ("Nome da mãe não especificado.");
      this.setState({
        isLoading: false,
      })
      return;
    }

    const valCPF = validateCPF(formatCPF(formatCPF(this.state.CPFMae, 'digits')));
    if (!valCPF){
      alert ("CPF inválido. Digite um CPF válido.");
      this.setState({
        isLoading: false,
      })
      return;
    }

    if (this.state.datamens==''){
      alert ("Data de Pagamento inválida. Selecione uma data válida.");
      this.setState({
        isLoading: false,
      })
      return;
    }


    const { navigation } = this.props;
    let data = {
      AlunoId: this.state.AlunoId,
      Nome: this.state.AlunoNome,
      DataNasc: this.state.date,
      SerieIngresso: this.state.SerieIngresso,
      CEP: this.state.cep,
      Rua: this.state.Rua,
      NumeroRes: this.state.NumeroRes,
      Complemento: this.state.Complemento,
      Bairro: this.state.Bairro,
      Cidade: this.state.Cidade,
      Estado: this.state.Estado,
      NomeMae: this.state.NomeMae,
      CPFMae: this.state.CPFMae,
      DataMens: this.state.datamens
    }

    db.updateAluno(data.AlunoId, data).then((result) => {
      console.log(result);
      this.setState({
        isLoading: false,
      });
      this.props.navigation.state.params.onNavigateBack;
      this.props.navigation.goBack();
    }).catch((err) => {
      console.log(err);
      this.setState({
        isLoading: false,
      });
    })
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }

    {this._getItem(this.state.uf.toString())}
    return (
      <ScrollView style={styles.container}>
          <TextInput style={styles.cabecalho}
              value={'ID'}
              editable={false}
              textAlign='right'
          />
          <View style={styles.subContainer}>
            <TextInput
              placeholder={'ID'}
              value={this.state.AlunoId}
              maxLength={17}
              onChangeText={(text) => this.updateTextInput(text, 'AlunoId')}
              editable={false}
            />
          </View>
          <TextInput style={styles.cabecalho}
              value={'Aluno'}
              editable={false}
              textAlign='right'
          />
          <View style={styles.subContainer}>
            <TextInput
              placeholder={'Nome Aluno'}
              value={this.state.AlunoNome}
              maxLength={100}
              onChangeText={(text) => this.updateTextInput(text, 'AlunoNome')}
            />
          </View>
          <TextInput style={styles.cabecalho}
            value={'Data de Nascimento'}
            editable={false}
            textAlign='right'
          />
          <View style={styles.calendario}>
            <DatePicker  
              style={{width: 200}}
              date={this.state.date} //initial date from state
              mode="date" //The enum of date, datetime and time
              placeholder="selecione uma data"
              format="DD-MM-YYYY"
              minDate="01-01-1900"
              maxDate={new Date()}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0
              },
                dateInput: {
                marginLeft: 36
                }    
              }}
              onDateChange={(date) => {this.setState({date: date})}}  
            />
        </View>
        <TextInput style={styles.cabecalho}
          value={'Série de Ingresso'}
          editable={false}
          textAlign='right'
        />
        <View style={styles.subContainer}>            
          <RNPickerSelect
            placeholder={{
              label: 'Escolha uma série',
              value: null,
            }}
            items={[
              { label: '1º ANO', value: '1º ANO'},
              { label: '2º ANO', value: '2º ANO'},
              { label: '3º ANO', value: '3º ANO'},
            ]}
            value={this.state.SerieIngresso}
            onValueChange={(value) => this.updateTextInput(value, 'SerieIngresso')}
          />
        </View>
        <TextInput style={styles.cabecalho}
          value={'CEP'}
          editable={false}
          textAlign='right'
          />
        <View style={styles.subContainer}>
          <TextInputMask
            type={'zip-code'}
            placeholder={'CEP'}
            value={this.state.cep}
            onChangeText={text => this.updateTextInput(text, 'cep')}
          />
        </View>
        <TextInput style={styles.cabecalho}
          value={'Número Residencial'}
          editable={false}
          textAlign='right'
        />
        <View style={styles.subContainer}>
          <TextInput
            placeholder={'Número da Residência'}
            value={this.state.NumeroRes}
            keyboardType={'numeric'} 
            onChangeText={value => value.match(/[0-9]*/gm)}
            onChangeText={(text) => this.updateTextInput(text, 'NumeroRes')}
          />
        </View>
        <TextInput style={styles.cabecalho}
            value={'Rua'}
            editable={false}
            textAlign='right'
        />
        <View style={styles.subContainer}>
          <TextInput
            placeholder={'Rua'}
            maxLength={120}
            value={this.state.Rua}
            onChangeText={(text) => this.updateTextInput(text, 'Rua')}
          />
        </View>
        <TextInput style={styles.cabecalho}
            value={'Complemento'}
            editable={false}
            textAlign='right'
        />
        <View style={styles.subContainer}>
          <TextInput
            placeholder={'Complemento'}
            maxLength={50}
            value={this.state.Complemento}
            onChangeText={(text) => this.updateTextInput(text, 'Complemento')}
          />
        </View>
        <TextInput style={styles.cabecalho}
            value={'Bairro'}
            editable={false}
            textAlign='right'
        />
        <View style={styles.subContainer}>
          <TextInput
            placeholder={'Bairro'}
            maxLength={100}
            value={this.state.Bairro}
            onChangeText={(text) => this.updateTextInput(text, 'Bairro')}
          />
        </View>
        
        <TextInput style={styles.cabecalho}
            value={'Estado e Cidade'}
            editable={false}
            textAlign='right'
        />
        <View style={styles.subContainer}>
          <Picker
              selectedValue={this.state.uf}
              style={{ height: 50, width: 120 }}
              onValueChange={this._onChageValue.bind(this)}   
          >
            {
              estados.map((element, index) => {
                  return <Picker.Item label={element.sigla} value={element.sigla} />
              })
            }
          </Picker>

          <Picker
              style={{ height: 50, width: 220 }}

              selectedValue={(this.state && this.state.pickerValue) || 'a'}
              onValueChange={(value) => {
                this.setState({pickerValue: value, Cidade:value});
              }} 
          >
            {this.state.data && this.state.data.map(value=> (<Picker.Item label={value} value={value}/>))}
          </Picker>
        </View>

        <TextInput style={styles.cabecalho}
          value={'Nome da Mãe'}
          editable={false}
          textAlign='right'
        />
        <View style={styles.subContainer}>
          <TextInput
              placeholder={'Nome da Mãe'}
              maxLength={100}
              value={this.state.NomeMae}
              onChangeText={(text) => this.updateTextInput(text, 'NomeMae')}
          />
        </View>
        <TextInput style={styles.cabecalho}
          value={'CPF da mãe'}
          editable={false}
          textAlign='right'
        />
        <View style={styles.subContainer}>
          <TextInputMask
            type={'cpf'}
            placeholder={'CPF da Mãe'}
            value={this.state.CPFMae}
            onChangeText={text => this.updateTextInput(text, 'CPFMae')}
          />
        </View>
        <TextInput style={styles.cabecalho}
          value={'Data de Pagamento'}
          editable={false}
          textAlign='right'
        />
        <View style={styles.calendario}>
          <DatePicker       
            style={{width: 200}}
            date={this.state.datamens} //initial date from state
            mode="date" //The enum of date, datetime and time
            placeholder="selecione uma data"
            format="DD-MM-YYYY"
            minDate={new Date()}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0
            },
              dateInput: {
              marginLeft: 36
            }
            }}
            onDateChange={(date) => {this.setState({datamens: date})}}             
          />
        </View>
        <View style={styles.button}>
          <Button
            large
            leftIcon={{name: 'save'}}
            title='Salvar'
            onPress={() => this.updateAluno()}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 20,
      paddingTop:3
    },
    subContainer: {
      flex: 1,
      marginBottom: 20,
      padding: 5,
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
    button:{
      marginTop: 1,
      paddingTop: 1,
      paddingBottom: 10,
      marginBottom: 20,
      paddingRight:13,
      paddingLeft:13,

    },
    calendario:{
      flex: 1,
      marginBottom: 25,
      padding: 5,
      paddingBottom: 10,
      borderBottomWidth: 2,
      borderBottomColor: '#CCCCCC',
    },
    cabecalho:{
      paddingBottom: 0,
      paddingTop: 0,
      paddingRight:11,
      fontWeight:'800'
      //fontColor:'black'
      //backgroundColor:'blue'
    }
  })