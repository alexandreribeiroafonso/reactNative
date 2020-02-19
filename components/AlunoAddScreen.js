import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, TextInput, Picker, Text } from 'react-native';
import { Button } from 'react-native-elements';
import Database from '../Database';
import ModalDropdown from 'react-native-modal-dropdown';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-datepicker'
import cep from 'cep-promise'
import { validate as validateCPF } from 'gerador-validador-cpf'
import { format as formatCPF } from 'gerador-validador-cpf'
import { TextInputMask } from 'react-native-masked-text'
import { estados } from '../components/JSONCidades'
import 'moment/locale/pt-br'



const db = new Database();


export default class AlunoAddScreen extends Component {

  static navigationOptions = {
    title: 'Add Aluno',
  };
 
  constructor() {
    super();
    this.state = {
      AlunoId:'',
      AlunoNome:'',
      SerieIngresso:'',
      cep:'',
      valCep:true,
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
      date:'',
      isLoading: false,

      uf: '', 
      cidade: '', 
      selectedValueCidade: '', 
      data: []
    };
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

  _onChageValue = (value) => {
      this.setState({ uf: value })
  }

  _onChageValue2 = (value) => {
      this.setState({cidade: value})
       //console.warn(value)
  }


  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  saveAluno() {
    this.setState({
      isLoading: true,
    });
    
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

    if (this.state.SerieIngresso==null || this.state.SerieIngresso=='Escolha uma série'){
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

    const datam = new Date();
    this.state.AlunoId = formatCPF(this.state.CPFMae, 'digits') + datam.getHours() + datam.getMinutes() + datam.getSeconds();

    //alert (this.state.AlunoId); 

      let data = {
        AlunoId: this.state.AlunoId,
        AlunoNome: this.state.AlunoNome,
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
      
      cep(this.state.cep).then(
        num=>{
        db.addAluno(data).then((result) => {
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
        })},
        num=>{
          alert ("CEP inválido. Digite um CEP válido.");
          this.setState({
            isLoading: false,
          });
        }
      )
  }

  componentDidMount() {
    this.setState({
      uf: estados,
      selectedValueEstado: '',
      selectedValueCidade: ''
    })
  }

  renderValueChangeEstado = (value) => {
    console.warn(value.sigla)
    this.setState({
      selectedValueEstado: value
    })
  }


  renderValueChangeCidade = (value) => {
    console.warn(value)
    this.setState({
      selectedValueCidade: value
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

    const { selectedValueCidade, selectedValueEstado, uf } = this.state;

    return(
      <ScrollView style={styles.container}>
        <View style={styles.subContainer}>
            <TextInput
                placeholder={'Nome Aluno'}
                value={this.state.AlunoNome}
                maxLength={100}
                onChangeText={(text) => this.updateTextInput(text, 'AlunoNome')}
            />
        </View>
        <TextInput style={styles.cabecalho}
            value={'Data Nascimento'}
            editable={false}
            textAlign='left'
        />
        <View style={styles.calendario}>
          <DatePicker
            style={{width: 200}}
            format='lll'
            locale='pt-BR'
            placeholder="selecione uma data"
            date={this.state.date} //initial date from state
            mode="date" //The enum of date, datetime and time
            format="DD-MM-YYYY"
            maxDate="12-12-2025"
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
            onDateChange={(date) => {this.setState({date})}}            
          />
        </View>
        <TextInput style={styles.cabecalho}
            value={'Série de Ingresso'}
            editable={false}
            textAlign='left'
        />
        <View style={styles.subContainer}>            
        <RNPickerSelect
             placeholder={{
               label: 'Escolha uma série',
               value: null,
             }}
            onValueChange={(value) => this.updateTextInput(value, 'SerieIngresso')}
            items={[
                { label: '1º ANO', value: '1º ANO'},
                { label: '2º ANO', value: '2º ANO'},
                { label: '3º ANO', value: '3º ANO'},
            ]}
        />
        </View>
        <View style={styles.subContainer}>
          <TextInputMask
            type={'zip-code'}
            placeholder={'CEP'}
            value={this.state.cep}
            onChangeText={text => this.updateTextInput(text, 'cep')}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
              placeholder={'Número da Residência'}
              value={this.state.NumeroRes}
              keyboardType={'numeric'} 
              onChangeText={value => value.match(/[0-9]*/gm)}
              onChangeText={(text) => this.updateTextInput(text, 'NumeroRes')}

          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
              placeholder={'Rua'}
              maxLength={120}
              value={this.state.Rua}
              onChangeText={(text) => this.updateTextInput(text, 'Rua')}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
              placeholder={'Complemento'}
              maxLength={50}
              value={this.state.Complemento}
              onChangeText={(text) => this.updateTextInput(text, 'Complemento')}
          />
        </View>
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
            textAlign='left'
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

        <View style={styles.subContainer}>
          <TextInput
              placeholder={'Nome da Mãe'}
              maxLength={100}
              value={this.state.NomeMae}
              onChangeText={(text) => this.updateTextInput(text, 'NomeMae')}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInputMask
            type={'cpf'}
            placeholder={'CPF da Mãe'}
            value={this.state.CPFMae}
            onChangeText={text => this.updateTextInput(text, 'CPFMae')}
          />
        </View>
        <TextInput style={styles.cabecalho}
            value={'Data Pagamento'}
            editable={false}
            textAlign='left'
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
            onPress={() => this.saveAluno()} />
        </View>
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
  }
})
