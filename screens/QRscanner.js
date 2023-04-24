import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Button, Dialog} from '@rneui/themed';
import styles from './../styles/Style';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from "react-native-camera";
import XLSX from 'xlsx'; // import the xlsx library

function QRscanner() {

    const [qrValue, setQrValue] = useState('')
    const [light, setLight] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [productData, setProductData] = useState([])

    const splitQRCode = (code) => {
        const first16Chars = code.slice(0, 16)
        const restChars = code.slice(16)
        return { first16Chars, restChars }
    }

    const getProductData = async () => {
        try {
            const workbook = XLSX.readFile('products.xlsx')
            const sheetName = 'Sheet1' // Replace with the name of your sheet
            const sheet = workbook.Sheets[sheetName]
            const data = XLSX.utils.sheet_to_json(sheet)
            setProductData(data)
        } catch (error) {
            console.error(error)
        }
    }

    const findMalkod = (barcode) => {
        const product = productData.find((p) => p.BARKOD === barcode)
        if (product) {
            return product.MALKOD
        } else {
            return ''
        }
    }

    useEffect(() => {
        getProductData()
    }, [])

    return (
    <View style={styles.container}>
        <QRCodeScanner
            ref={(node) => { this.scanner = node }}
            onRead={(e) => {
                setShowDialog(true)
                setQrValue(e.data)
            }}
            flashMode={light ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.auto}
            topContent={<></>}
            bottomContent={
                <Button
                    title={`Flash ${light ? 'OFF' : 'ON'}`}
                    icon={{ ...styles.iconButtonHome, size: 20, name: 'qr-code-scanner' }}
                    iconContainerStyle={styles.iconButtonHomeContainer}
                    titleStyle={{ ...styles.titleButtonHome, fontSize: 20 }}
                    buttonStyle={{...styles.buttonHome, height: 50}}
                    containerStyle={{...styles.buttonHomeContainer, marginTop:20, marginBottom:10}}
                    // onPress={() => {this.scanner.reactivate()}}
                    onPress={() => {setLight(!light)}}
                />
            }
        />
        <Dialog
        isVisible={showDialog}
        onBackdropPress={() => setShowDialog(!showDialog)}>
            <Dialog.Title titleStyle={{color:'#ff0000', fontSize:25}} title="Scanned QR:"/>
            <Text style={{color:'#000', fontSize: 15}}>
                {"QR Result: " +qrValue}
            </Text>
            <Text style={{color:'#000', fontSize: 25}}>
                {"Product ID: " + splitQRCode(qrValue).first16Chars}
            </Text>
            <Text style={{color:'#000', fontSize: 25}}>
                {"Serial No: " + splitQRCode(qrValue).restChars}
            </Text>
            <Text style={{color:'#8a0000', fontSize: 30}}>
                {"Product Name: "+ (malkod ? malkod : "Not Found...")}
            </Text>
            <Dialog.Actions>
                <Dialog.Button title="Scan Again" onPress={() => {
                    this.scanner.reactivate()
                    setShowDialog(false)
                }}/>
            </Dialog.Actions>
        </Dialog>
    </View>
    );
}

export default QRscanner
