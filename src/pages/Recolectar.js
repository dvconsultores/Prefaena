/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, Text, TouchableOpacity } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { ListItem, Divider } from "react-native-elements";
import Moment from "moment";
import crud from "./Crud";
import Icon from "react-native-vector-icons/FontAwesome";
import { Alert } from "react-native";

export function ReactNativeDateFormat({ value }) {
  return <Text> {Moment(value).format("DD/MM/yyyy HH:mm")} </Text>;
}

const Recolectar = ({ navigation, route }) => {
  const [list, setList] = useState([]);

  async function SelectTickets() {
    let query =
      "select *, case FLEstatus when 'AB' then 'Abierto' when 'FE' then 'Cerrado' else 'Cancelado' end estatus from tickets order by FLEstatus asc";
    let selectQuery = await crud.ExecuteQuery(query, []);
    var rows = selectQuery.rows;
    var temp = [];
    for (let i = 0; i < rows.length; i++) {
      temp.push(rows.item(i));
    }
    setList(temp);
  }

  //List medoto de recoleccion
  async function isOpen(p1, p2, p3, p4, p5, p6) {
    let query =
      "select case when FLEstatus = 'FE' then 'false'  when FLEstatus = 'CN' then 'false' else 'true' end as FLEstatus from tickets where NumTicket = ? and GranjaLote = ?";
    let selectQuery = await crud.ExecuteQuery(query, [p1, p2.split(" / ")[0]]);
    var rows = selectQuery.rows;
    //console.log(rows.item(0).FLEstatus);
    if (rows.item(0).FLEstatus == "true") {
      navigation.navigate("RecolectarD", {
        ticket: p1,
        lote: p2,
        jaulas: p3,
        animalesjaulas: p4,
        DesCuadrilla: p5,
        IdOrden: p6,
      });
    } else {
      navigation.navigate("Impresora", {
        ticket: p1,
        lote: p2,
        jaulas: p3,
        IdOrden: p6,
      });
    }
  }

  async function navegar()  {
    let query = "select * from tickets where FLEstatus = 'AB'";
    let selectQuery = await crud.ExecuteQuery(query, []);
    //console.log(selectQuery.rows.length);
    if (selectQuery.rows.length > 0) {
      Alert.alert(
        "Mensaje",
        "Todos los tickets deben estar cerrados o cancelados para imprimir cierre"
      );
    } else {
     navigation.navigate("Cierre");
    }
  }

  //Hook
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      SelectTickets();
    });
    return unsubscribe;
    //Crear tabla tickets
    SelectTickets();
  }, []);

  return (
    <ScrollView style={styles.titleText}>
      <Divider style={{ backgroundColor: "#FFF", height: 5 }} />
      <TouchableOpacity style={styles.BtnEstatus} onPress={() => navegar()}>
        <Text style={styles.btnText}>Imprimir Cierre Prefaena</Text>
        <Icon color="#00843D" name="print" size={25} />
      </TouchableOpacity>
      {list.map((item, i) => (
        <ListItem
          key={i}
          bottomDivider
          topDivider
          onPress={() =>
            isOpen(
              item.NumTicket,
              item.GranjaLote + " / " + item.NumOrdenTrans,
              item.CantidadJaulas,
              item.AnimalesPJaulas,
              item.DesCuadrilla,
              item.IdOrden
            )
          }
        >
          <ListItem.Content>
            <ListItem.Title>
              <Text style={styles.subtitle}>Estatus : </Text>
              {item.estatus}
            </ListItem.Title>
            <ListItem.Title>
              <Text style={styles.subtitle}>Cuadrilla : </Text>
              {item.DesCuadrilla}
            </ListItem.Title>
            <ListItem.Title>
              <Text style={styles.subtitle}>PLaca : </Text>
              {item.PlacaVehiculo}
            </ListItem.Title>
            <ListItem.Subtitle>
              <Text style={styles.subtitle}>Nro.Ticket: </Text>
              {item.NumTicket}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle}>Nro.Orden: </Text>
              {item.NumOrdenTrans}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle}>Fecha recolección: </Text>
              <ReactNativeDateFormat value={item.FechaRecoleccion} />
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle}>Estatus: </Text>
              {item.FLEstatus}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle}>Conductor : </Text>
              {item.Conductor}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle}>Remolque1 : </Text>
              {item.Remolque1}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle}>Remolque2 : </Text>
              {item.Remolque2}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle}>Motivo cancelación : </Text>
              {item.IdMotivoCancelacion}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle}>Lote compuesto : </Text>
              {item.GranjaLote}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle}>Propiedad : </Text>
              {item.desGranja}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle}>Equipo recolección : </Text>
              {item.equiporecoleccionVAl}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle}>Fecha programación : </Text>
              <ReactNativeDateFormat value={item.FechaProgramacion} />
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle}>Total animales : </Text>
              {item.TotalAnimales}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle}>Cantidad en jaula : </Text>
              {item.CantidadJaulas}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              <Text style={styles.subtitle}>Animales en jaula : </Text>
              {item.AnimalesPJaulas}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
   BtnEstatus: {
    backgroundColor: "#E6E1C5",
    borderRadius: 5,
    width: "99%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Ubuntu",
  },
});

export default Recolectar;
