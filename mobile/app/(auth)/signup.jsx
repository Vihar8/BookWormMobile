import { View, Text, Platform, KeyboardAvoidingView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import styles from "../../assets/styles/signup.styles";
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';


export default function signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setpassword] = useState("");
    const [showPassword, setshowPassword] = useState(false);
    const {user, isLoading, register, token} = useAuthStore();
    const router = useRouter();


    const handleSignup = async() => {
        console.log("hi hiu hihdsfihfjk")
        const result = await register(username, email, password);

        if(!result.success) Alert.alert("Error", result.error);
    };

    console.log(user);
    console.log(token);
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.title}>BookWorm🐛</Text>
                        <Text style={styles.subtitle}>Share your favorite reads</Text>
                    </View>
                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Username</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="person-outline"
                                    size={20}
                                    color={COLORS.primary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder='John Doe'
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={username}
                                    onChangeText={setUsername}
                                />

                            </View>
                        </View>
                        <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color={COLORS.primary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Enter your email'
                                placeholderTextColor={COLORS.placeholderText}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>password</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color={COLORS.primary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Enter your password'
                                placeholderTextColor={COLORS.placeholderText}
                                value={password}
                                onChangeText={setpassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setshowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                                    size={20}
                                    color={COLORS.primary}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={handleSignup}
                        style={styles.button}
                        disabled={isLoading}
                    >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />   
                    ) : (
                        <Text style={styles.buttonText}>Sign Up</Text>
                    )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account?</Text>
                            {/* <Link href="/(auth)" asChild> */}
                                <TouchableOpacity onPress={() => router.back()}>
                                    <Text style={styles.link}>Login</Text>
                                </TouchableOpacity>
                            {/* </Link> */}
                    </View>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}