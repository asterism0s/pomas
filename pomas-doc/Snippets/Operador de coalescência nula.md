
```javascript
const breakInterval = parseInt(getUserBreakInterval() ?? '4', 10); 
```

-> Se não existir nada salvo (ou for `null`), usa `'4'` como valor padrão.
-> **`parseInt(..., 10)`**  -> Converte a string em número inteiro na base decimal.