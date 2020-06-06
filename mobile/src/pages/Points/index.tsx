import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Image, SafeAreaView, Alert} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Constants from "expo-constants";
import MapView, { Marker } from "react-native-maps";
import { SvgUri } from "react-native-svg";
import * as Location from "expo-location";
import api from "../../services/api";
import Emoji from "react-native-emoji";

interface Item{
    id: number,
    title: string,
    image_url: string
}
interface Point{
    id: number,
    name: string,
    image: string,
    latitude: number,
    longitude: number,
}
interface Params{
    uf: string,
    city: string
}


const Points = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [selectedItems, setselectedItems] = useState<number[]>([]);
    const [initialPosition, setinitialPosition] = useState<[number, number]>([0, 0]);
    const [points, setpoints] = useState<Point[]>([]);

    const navigation = useNavigation();
    const route = useRoute();

    const routeParams = route.params as Params;

    // FUNÇÃO QUE VERIFICA O ITEM ESCOLHIDO PELO USUÁRIO PARA SER COLETADO
	function handleSelectItem(id: number){
		// FINDINDEX: RETORNA UM NÚMERO ACIMA OU IGUAL A 0, SE O ITEM JÁ ESTIVER NO ARRAY
		const alrerySelected = selectedItems.findIndex(item => item === id);
		// SE O ITEM JÁ ESTIVER NO ARRAY ELE BUSCA E FAZ UM NOVO ARRAY SEM O MESMO
		if(alrerySelected > -1){
			const filteredItems = selectedItems.filter(item => item !== id);
			setselectedItems(filteredItems);
		}	
		else{
			setselectedItems([...selectedItems, id]);
		}
	}

    function handleNavigateBack(){
        navigation.goBack();
    }

    // TUDO QUE EU PASSO NO OBJETO DEPOIS DE DETAIL SERÁ PASSADO PARA A TELA DE DETAIL
    function handleNavigateToDetail(id: number){
        navigation.navigate("Detail", { point_id: id })
    }

    // BUSCAR ITEMS DA NOSSA API
    useEffect(() => {
        api.get("items").then(response => {
            setItems(response.data);
        })
    }, []);

    // BUSCAR LOCALIZAÇÃO DO USUÁRIOS 
    // PEDINDO PERMISSÕES AO MESMO
    useEffect(() => {
        async function loadPosition(){
            const { status } =  await Location.requestPermissionsAsync();

            if(status !== "granted"){
                Alert.alert("Ooops!", "Precisamos de sua permissão para obter a localização")
                return;
            }

            const location = Location.getCurrentPositionAsync();

            const { latitude, longitude } = (await location).coords;
            
            setinitialPosition([
                latitude, 
                longitude
            ]);
        }

        loadPosition();
    }, []);

    useEffect(() => {
        api.get("collect_points", {
            params:{
                city: routeParams.city,
                uf: routeParams.uf,
                items: selectedItems
            }
        }).then(reponse => {
            setpoints(reponse.data)
        })
    }, [selectedItems]);


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon 
                        name="arrow-left" 
                        color="#34cb79" 
                        size={25} 
                    />
                </TouchableOpacity>

                <Text style={styles.title}>
                    {/* <Emoji name="smile" style={{fontSize: 20}} /> */}
                    Bem vindo.
                </Text>
                <Text style={styles.description}>
                    Encontre no mapa um ponto de coleta
                </Text>
                
                <View style={styles.mapContainer}>
                    {/* TESTE DE CONDICIONAL PARA RENDERIZAÇÃO DO MAPA */}
                    { initialPosition[0] !== 0 && (
                        <MapView 
                            style={styles.map}
                            loadingEnabled={ initialPosition[0] === 0 }
                            initialRegion={{
                                latitude: initialPosition[0],
                                longitude: initialPosition[1],
                                // 0.014 número para deixar o zoom do mapa ajustado
                                latitudeDelta: 0.014,
                                longitudeDelta: 0.014
                            }}
                        >
                             {points.map(point => (
                                <Marker 
                                    key={String(point.id)}
                                    style={styles.mapMarker}
                                    coordinate={{
                                        latitude: point.latitude,
                                        longitude: point.longitude,
                                    }} 
                                    onPress={() => handleNavigateToDetail(point.id)}
                                >
                                    <View style={styles.mapMarkerContainer}>
                                        <Image 
                                            style={styles.mapMarkerImage}
                                            source={{
                                                uri: point.image
                                            }}
                                        />
        
                                        <Text style={styles.mapMarkerTitle}>
                                            {point.name}
                                        </Text>
                                    </View>
                                </Marker> 
                             ))} 
                        </MapView>
                    )}
                </View>
            </View>

            <View style={styles.itemsContainer}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                    {items.map(item => (
                        <TouchableOpacity 
                            key={String(item.id)}
                            style={[
                                styles.item,
                                selectedItems.includes(item.id) ? 
                                    styles.selectedItem 
                                    : {}
                            ]} 
                            onPress={() => handleSelectItem(item.id)}
                            activeOpacity={0.6}
                        >
                            <SvgUri 
                                width={42}
                                height={42}
                                uri={item.image_url}
                            />
                            <Text style={styles.itemTitle}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 20 + Constants.statusBarHeight,
    },

    title: {
        fontSize: 20,
        // fontFamily: 'Ubuntu_700Bold',
        marginTop: 24,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 4,
        // fontFamily: 'Roboto_400Regular',
    },

    mapContainer: {
        flex: 1,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 16,
    },

    map: {
        width: '100%',
        height: '100%',
    },

    mapMarker: {
        width: 90,
        height: 80, 
    },

    mapMarkerContainer: {
        width: 90,
        height: 70,
        backgroundColor: '#34CB79',
        flexDirection: 'column',
        borderRadius: 8,
        overflow: 'hidden',
        alignItems: 'center'
    },

    mapMarkerImage: {
        width: 90,
        height: 45,
        resizeMode: 'cover',
    },

    mapMarkerTitle: {
        flex: 1,
        // fontFamily: 'Roboto_400Regular',
        color: '#FFF',
        fontSize: 13,
        lineHeight: 23,
    },

    itemsContainer: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 32,
    },

    item: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#eee',
        height: 120,
        width: 120,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'space-between',

        textAlign: 'center',
    },

    selectedItem: {
        borderColor: '#34CB79',
        borderWidth: 2,
    },

    itemTitle: {
        fontFamily: 'Roboto_400Regular',
        textAlign: 'center',
        fontSize: 13,
    },
});



export default Points;