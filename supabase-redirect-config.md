# Configurar URLs de redirección en Supabase

## 1. Ve a tu proyecto de Supabase Dashboard

## 2. Authentication → URL Configuration

**Site URL:** `http://localhost:5173`

**Redirect URLs:** Agrega estas URLs (una por línea):
```
http://localhost:5173
http://localhost:5173/**
https://localhost:5173
https://localhost:5173/**
```

## 3. Authentication → Settings

**Deshabilita temporalmente email confirmations:**
- ✅ **Desmarcar** "Enable email confirmations"
- Esto permitirá registro directo sin confirmación por email

## 4. Si quieres mantener email confirmations:

**Email Templates → Confirm signup:**
Cambia la URL en el template de:
```
{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup
```
a:
```
{{ .SiteURL }}#access_token={{ .Token }}&refresh_token={{ .RefreshToken }}&expires_in={{ .ExpiresIn }}&token_type=bearer&type=signup
```

## 5. Alternativa más simple:

Por ahora, **deshabilita las confirmaciones por email** en Authentication → Settings:
- ✅ Desmarcar "Enable email confirmations" 
- ✅ Desmarcar "Enable phone confirmations"

Esto permitirá registro e inicio de sesión inmediatos sin confirmación.