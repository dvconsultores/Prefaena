/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { ListItem, Divider, Button } from "react-native-elements";
import * as yup from "yup";
import { Formik } from "formik";
import { TextInputMask } from "react-native-masked-text";
import { Picker } from "@react-native-picker/picker";
import crud from "./Crud";
import Icon from "react-native-vector-icons/FontAwesome";


const RecolectarDTable = ({ navigation, route }) => {
  const [table, setTable] = useState([]);
  var [table1, setTable1] = useState('0');
  var [limit, setLimit] = useState('0');
  const [listGalpon, setListGalpon] = useState([]);
  const [selectedGalpon, setSelectedGalpon] = useState([]);

  const list = [
    {
      ticket: "Nro.Ticket",
      ticketVal: route.params.ticket,
      lote: "Lote",
      loteVal: route.params.lote,
    },
  ];
  const inputStyle = {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    padding: 12,
    color: "black",
    fontFamily: "Ubuntu",
    marginBottom: 5,
  };

  //Asignar lista galpones
  async function SelectSincroGalpones() {
    let query = "select Galpon from SincroGalpones where GranjaLote = ? order by Galpon";
    let selectQuery = await crud.ExecuteQuery(query, [route.params.lote.split(" / ")[0]]);
    var temp = [];
    var rows = selectQuery.rows;
    //console.log(route.params.lote.split(" / ")[0])
    //console.log(rows.length)
    for (let i = 0; i < rows.length; i++) {
      temp.push(rows.item(i));
    }
    setListGalpon(temp);
  }

   //Render picker sicnrocuadrilla using map
   const pickerGalpon = listGalpon.map((data) => {
    return (
      <Picker.Item
        label={data.Galpon}
        value={data.Galpon}
        key={data.Galpon}
      />
    );
  });

  //List medoto de recoleccion
  async function SelectTicketsDetalle() {
    let query = "select * from TicketsDetalle where IdOrden = ?";
    let selectQuery = await crud.ExecuteQuery(query, [
      route.params.IdOrden,
    ]);
    var rows = selectQuery.rows;
    var temp = [];
    for (let i = 0; i < rows.length; i++) {
      temp.push(rows.item(i));
    }
    setTable(temp);
    setLimit(rows.length)
  }


  async function SelectSumCantidadJaulasReal() {
    setTable1(0);
    let query =
      "select case when sum(CantidadJaulasReal) is null then 0 else sum(CantidadJaulasReal) end sumCantidadJaulasReal from TicketsDetalle where IdOrden = ?";
    let selectQuery = await crud.ExecuteQuery(query, [
      route.params.IdOrden,
    ]);
    var rows = selectQuery.rows;
    if (selectQuery.rows.length > 0) {
      setTable1(rows.item(0).sumCantidadJaulasReal);
    }
  }

  const insert = (p1, p2, p3, p4, p5, p6, p7) => {
    SelectSumCantidadJaulasReal();
    // console.log(p7);
    // console.log(crud.validator(p7));
    var top = Number(table1) + Number(p5);
    var topJaulas = Number(route.params.jaulas);
    var jaulasVacias = Number(route.params.jaulas) - Number(table1) - Number(p5);
    
    if (top > topJaulas) {
      Alert.alert(
        "Mensaje",
        "El número de jaulas no puede superar al limite establecido, intente un número menor."
      );
    } else if (crud.validator(p7)) {
      Alert.alert("Mensaje", "El formato de fecha de retirada de alimento es inválido");
    } else if (limit >= 2) {
      Alert.alert("Mensaje", "No puede ingresar mas de dos galpones");   
    } else {  
      crud.InsertTicketsDetallenoSync(p1, p2, p3, p4, p5, p6, p7, jaulasVacias, route.params.ticket);
      setTable1(0);
      setTimeout(() => {
        SelectTicketsDetalle();
      }, 1000);
      setTimeout(() => {
        SelectSumCantidadJaulasReal();
      }, 1200);
    }
  };

  const deleteTable = (p1, p2) => {
    SelectSumCantidadJaulasReal();
    var jaulasVacias = Number(route.params.jaulas) - Number(table1) + Number(p2);
   // console.log('Jaulas v ' + jaulasVacias);

    crud.DeleteTicketsDetallenoSync(p1, jaulasVacias, route.params.ticket);
    setTable1(0);
    setTimeout(() => {
      SelectTicketsDetalle();
    }, 1000);
    setTimeout(() => {
      SelectSumCantidadJaulasReal();
    }, 1200);
  };


  //Hook
  useEffect(() => {
    setTimeout(() => {
      SelectTicketsDetalle();
    }, 1000);
    setTimeout(() => {
      SelectSumCantidadJaulasReal();
    }, 1200);
    setTimeout(() => {
      SelectSincroGalpones();
    }, 1200);
    
  }, []);

  return (
    <ScrollView style={styles.scrollView}>
      {list.map((item, i) => (
        <ListItem key={i} bottomDivider>
          <Image
            source={require("../assets/img/delete-ticket-32.png")}
            style={styles.logo}
          />
          <ListItem.Content>
            <ListItem.Title>
              <Text style={styles.subtitle}>{item.ticket}: </Text>
              {item.ticketVal}
            </ListItem.Title>
            <ListItem.Subtitle>
              <Text style={styles.subtitle}>{item.lote}: </Text>
              {item.loteVal.split(" / ")[0]}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text>Nro.Orden: </Text>
              {item.loteVal.split(" / ")[1]}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text>Jaulas vacias: </Text>
              {Number(route.params.jaulas) - Number(table1)}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
      <Formik
        initialValues={{
          jaulas: route.params.jaulas,
          aves: route.params.animalesjaulas,
          dt5: "",
          idorden:route.params.IdOrden
        }}
        onSubmit={(values) =>
          insert(
            "",
            values.idorden,
            selectedGalpon,
            values.aves * values.jaulas,
            values.jaulas,
            values.aves,
            values.dt5,
          )
        }
        validationSchema={yup.object().shape({
          jaulas: yup.string().required("Campo requerido!"),
          aves: yup.string().required("Campo requerido!"),
          dt5: yup.string().required("Campo requerido!"),
        })}
      >
        {({
          values,
          handleChange,
          errors,
          setFieldTouched,
          touched,
          isValid,
          handleSubmit,
        }) => (
          <View style={styles.formContainer}>
            <Text>Galpón</Text>
            <Picker
              selectedValue={selectedGalpon}
              style={styles.pickerStyle}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedGalpon(itemValue)
              }
            >
              <Picker.Item label="Selecionar un galpón" />
              {pickerGalpon}
            </Picker>
            <Text>Nro.Jaulas</Text>
            <TextInputMask
              style={inputStyle}
              type={"only-numbers"}
              placeholder="Nro.Jaulas"
              value={values.jaulas}
              onChangeText={handleChange("jaulas")}
              onBlur={() => setFieldTouched("jaulas")}
            />
            {touched.jaulas && errors.jaulas && (
              <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                {errors.jaulas}
              </Text>
            )}
            <Text>Aves/Jaulas</Text>
            <TextInputMask
              style={inputStyle}
              type={"only-numbers"}
              placeholder="Aves/Jaulas"
              value={values.aves}
              onChangeText={handleChange("aves")}
              onBlur={() => setFieldTouched("aves")}
            />
            {touched.aves && errors.aves && (
              <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                {errors.aves}
              </Text>
            )}
            <Text>Retirada de alimento (DD/MM/YYYY HH:mm 24 horas)</Text>
            <TextInputMask
              style={inputStyle}
              type={"datetime"}
              placeholder="Retirada de alimento (DD/MM/YYYY HH:mm 24 horas)"
              options={{
                format: "DD/MM/YYYY HH:mm",
              }}
              value={values.dt5}
              onChangeText={handleChange("dt5")}
              onBlur={() => setFieldTouched("dt5")}
            />
            {touched.dt5 && errors.dt5 && (
              <Text style={{ fontSize: 12, color: "#FF0D10" }}>
                {errors.dt5}
              </Text>
            )}
            <Divider style={{ backgroundColor: "#FFF", height: 2 }} />
            <TouchableOpacity
              style={styles.loginBtn}
              disabled={!isValid}
              onPress={handleSubmit}
            >
              <Text style={styles.loginText}>GUARDAR</Text>
            </TouchableOpacity>
            <Divider style={{ backgroundColor: "#FFF", height: 3 }} />
            {table.map((item, i) => (
              <ListItem key={i} bottomDivider>
                <ListItem.Content>
                  <ListItem.Subtitle>
                    <Text style={styles.subtitle1}>Galpón: </Text>
                    {item.GalponReal}
                  </ListItem.Subtitle>
                  <ListItem.Subtitle>
                    <Text style={styles.subtitle1}>Nro. Jaulas: </Text>
                    {item.CantidadJaulasReal}
                  </ListItem.Subtitle>
                  <ListItem.Subtitle>
                    <Text style={styles.subtitle1}>Aves / Jaulas: </Text>
                    {item.AnimalesPJaulasReal}
                  </ListItem.Subtitle>
                  <ListItem.Subtitle>
                    <Text style={styles.subtitle1}>Total: </Text>
                    {item.TotalAnimalesReal}
                  </ListItem.Subtitle>
                  <ListItem.Subtitle>
                    <Text style={styles.subtitle1}>
                      Fecha retiro alimento:{" "}
                    </Text>
                    {item.FechaRetiradaAlimento}
                  </ListItem.Subtitle>
                </ListItem.Content>
                <Button
                  buttonStyle={styles.btn}
                  icon={<Icon name="trash" size={15} color="#DA291C" />}
                  type="outline"
                  onPress={() => deleteTable(item.id, item.CantidadJaulasReal)}
                />
              </ListItem>
            ))}
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Ubuntu",
  },
  formContainer: {
    backgroundColor: "#fff",
    height: "100%",
    width: "96%",
    marginLeft: "2%",
    fontFamily: "Ubuntu",
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 20,
    fontFamily: "Ubuntu",
  },
  subtitle1: {
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Ubuntu",
  },
  loginBtn: {
    backgroundColor: "#00843D",
    borderRadius: 5,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Ubuntu",
  },
  BtnDetalle: {
    backgroundColor: "#012169",
    borderRadius: 5,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Ubuntu",
  },
  loginText: {
    color: "white",
  },
  pickerStyle: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    padding: 12,
    fontFamily: "Ubuntu",
    marginBottom: 5,
  },
  btn: {
    borderColor: "#00843D",
  },
});

export default RecolectarDTable;
