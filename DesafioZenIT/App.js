import {StyleSheet, Button, Text, View, Image, Alert, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, { useState, useEffect } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import Api from './src/services/api';

const Main = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [racaSelect, setRacaSelect] = useState([]);
  const [urlImagem, setUrlImagem] = useState('https://picsum.photos/200/300?random=1');
  const [loading, setLoading] = useState(false);

  //função que procura as raças no Api pela seleção 
  useEffect(() => {
    async function carregarRacas() {
      try {
        const response = await Api.get(`/breeds/list`);
        setRacaSelect(response.data.message); 
      } catch (error) {
        console.error("Erro ao buscar raças: ", error);
        Alert.alert("Erro", "Não foi possível carregar a lista de raças.");
      }
    }
    carregarRacas();
  }, []); //array vazio faz que essa função rode apenas uma vez ao abrir o app

  //função que busca a imagem do animal escolhida ao clicar no botão de "gerar imagem" através da Api
  async function buscarAnimal() {
    if (!selectedValue) {
      Alert.alert("Opção inválida!", "Por favor, selecione uma raça.");
      return;
    }

    setLoading(true);

    try {
      const response = await Api.get(`/breed/${selectedValue}/images/random`);
      setUrlImagem(response.data.message);
    } catch (error) { //feito para achar possível erro de execução do código (me ajudar a achar o problema rsrs)
      console.error("Erro na consulta da API!", error);
      Alert.alert("Erro", "Não foi possível buscar a imagem da raça escolhida.");
    } finally {
      setLoading(false);
    }
  }
  
  //aqui é onde acontece o evento de click no botão exibido no "App"
  return (
    <View style={styles.container}>
      { <Text style={styles.label}>Primeiro projeto em React Native - Larissa R.S.</Text> }
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={setSelectedValue}
          items={racaSelect.map((raca) => ({ label: raca, value: raca }))}
          style={pickerSelectStyles}
          placeholder={{ label: 'Selecione a raça', value: null }}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={buscarAnimal}>
        <Text style={styles.buttonText}>Gerar Imagem</Text>
      </TouchableOpacity>
      {loading ? (<ActivityIndicator size="large" color="blue" style={styles.loading}/>) : (<Image style={styles.img1} source={{ uri: urlImagem }}/>)}
    </View>
  );
};

//estilização da imagem que for gerada ao escolher a raça do animal  
const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center'},
  selected: {marginTop: 10, fontSize: 16, fontWeight: 'bold'},
  img1: {height: 300, width: 300, margin: 100},
  button: {backgroundColor: 'gray', padding: 15, borderRadius: 5, marginTop: 10},
  buttonText: {color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center'},
  pickerContainer: {borderWidth: 1, borderColor: 'black', borderRadius: 10, paddingHorizontal: 10, width: 250, backgroundColor: 'white'},
  loading: { height: 300, width: 300, margin: 100 }
});

//estilização de seleção de animal
const pickerSelectStyles = {
  inputIOS: {alignItems: 'center', fontSize: 16, borderWidth: 1, borderColor: 'black', borderRadius: 5, color: 'black', marginBottom: 1},
  inputAndroid: {alignItems: 'center', fontSize: 16, borderWidth: 1, borderColor: 'black', borderRadius: 5, color: 'black', marginBottom: 1}
};

//roda a função principal (costumo chamar de 'body')
export default Main;