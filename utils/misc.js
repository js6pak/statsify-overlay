var colors = {
  "0": { hsl: "hsl(0, 0%, 0%)" },
  "1": { hsl: "hsl(240, 100%, 33%)" },
  "2": { hsl: "hsl(120, 100%, 33%)" },
  "3": { hsl: "hsl(180, 100%, 33%)" },
  "4": { hsl: "hsl(0, 100%, 33%)" },
  "5": { hsl: "hsl(300, 100%, 33%)" },
  "6": { hsl: "hsl(40, 100%, 50%)" },
  "7": { hsl: "hsl(0, 0%, 67%)" },
  "8": { hsl: "hsl(0, 0%, 33%)" },
  "9": { hsl: "hsl(240, 100%, 67%)" },
  "a": { hsl: "hsl(120, 100%, 67%)" },
  "b": { hsl: "hsl(180, 100%, 67%)" },
  "c": { hsl: "hsl(0, 100%, 67%)" },
  "d": { hsl: "hsl(300, 100%, 67%)" },
  "e": { hsl: "hsl(60, 100%, 67%)" },
  "f": { hsl: "hsl(0, 0%, 100%)" },
  "g": { hsl: "hsl(58, 96%, 44%)" },
  "s": { hsl: "hsl(205, 90%, 56%)" }
}

const getRank = json => {
  let rank = 'NON';
  if (json.monthlyPackageRank || json.packageRank || json.newPackageRank) {
      if (json.monthlyPackageRank == "SUPERSTAR") rank = replaceRank(json.monthlyPackageRank);
      else {
        if (json.packageRank && json.newPackageRank) rank = replaceRank(json.newPackageRank);
        else rank = replaceRank(json.packageRank || json.newPackageRank);
      }
    }
    if (json.rank && json.rank != 'NORMAL') rank = json.rank.replace('MODERATOR', 'MOD');
    if (json.prefix) rank = json.prefix.replace(/§.|\[|]/g, '');
    if (rank == "YOUTUBER") rank = "YOUTUBE"
  
    function replaceRank(toReplace) {
      return toReplace
        .replace('SUPERSTAR', "MVP++")
        .replace('VIP_PLUS', 'VIP+')
        .replace('MVP_PLUS', 'MVP+')
        .replace('NONE', '');
    }
  
    return rank.length == 0 ? `NON` : rank;
}

const getPlusColor = (rank, plus) => {
  if (plus == undefined || rank == 'PIG+++') {
    var rankColor = {
      'MVP+': { mc: '§c', hex: '#FF5555' },
      'MVP++': { mc: '§c', hex: '#FFAA00' },
      'VIP+': { mc: '§6', hex: '#FFAA00' },
      'PIG+++': { mc: '§b', hex: '#FF55FF' },
    }[rank]
    if (!rankColor) return { mc: '§7', hex: '#BAB6B6' }
  } else {
    var rankColorMC = {
      RED: { mc: '§c', hex: '#FF5555' },
      GOLD: { mc: '§6', hex: '#FFAA00' },
      GREEN: { mc: '§a', hex: '#55FF55' },
      YELLOW: { mc: '§e', hex: '#FFFF55' },
      LIGHT_PURPLE: { mc: '§d', hex: '#FF55FF' },
      WHITE: { mc: '§f', hex: '#F2F2F2' },
      BLUE: { mc: '§9', hex: '#5555FF' },
      DARK_GREEN: { mc: '§2', hex: '#00AA00' },
      DARK_RED: { mc: '§4', hex: '#AA0000' },
      DARK_AQUA: { mc: '§3', hex: '#00AAAA' },
      DARK_PURPLE: { mc: '§5', hex: '#AA00AA' },
      DARK_GRAY: { mc: '§8', hex: '#555555' },
      BLACK: { mc: '§0', hex: '#000000' },
      DARK_BLUE: { mc: '§1', hex: '#0000AA'}
    }[plus]
    if (!rankColorMC) return { mc: '§7', hex: '#BAB6B6' }
  }
  return rankColor || rankColorMC;
}

const getFormattedRank = (rank, color) => {
  if(read("appearance_rank") == false) rank = { 'MVP+': `§b[MVP${color}+§b]`, 'MVP++': `§6[MVP${color}++§6]`, 'MVP': '§b[MVP]', 'VIP+': `§a[VIP${color}+§a]`, 'VIP': `§a[VIP]`, 'YOUTUBE': `§c[§fYOUTUBE§c]`, 'PIG+++': `§d[PIG${color}+++§d]`, 'HELPER': `§9[HELPER]`, 'MOD': `§2[MOD]`, 'ADMIN': `§c[ADMIN]`, 'OWNER': `§c[OWNER]`, 'SLOTH': `§c[SLOTH]`, 'ANGUS': `§c[ANGUS]`, 'APPLE': '§6[APPLE]', 'MOJANG': `§6[MOJANG]`, 'BUILD TEAM': `§3[BUILD TEAM]`, 'EVENTS': `§6[EVENTS]` }[rank]
  else rank = { 'MVP+': `§b[M${color}+§b]`, 'MVP++': `§6[M${color}++§6]`, 'MVP': '§b[M]', 'VIP+': `§a[V${color}+§a]`, 'V': `§a[VIP]`, 'YOUTUBE': `§c[§fYT§c]`, 'PIG+++': `§d[P${color}+++§d]`, 'HELPER': `§9[H]`, 'MOD': `§2[M]`, 'ADMIN': `§c[A]`, 'OWNER': `§c[O]`, 'SLOTH': `§c[S]`, 'ANGUS': `§c[A]`, 'APPLE': '§6[A]', 'MOJANG': `§6[M]`, 'BUILD TEAM': `§3[BT]`, 'EVENTS': `§6[E]` }[rank]
  
  if (!rank) return `§7`
  return `${rank} `
}

const getRankColor = (rank) => {
  if (["YOUTUBE", "ADMIN", "OWNER", "SLOTH"].includes(rank)) return "c";
  else if (rank == "PIG+++") return "d";
  else if (rank == "MOD") return "2";
  else if (rank == "HELPER") return "9";
  else if (rank == "BUILD TEAM") return "3";
  else if (["MVP++", "APPLE", "MOJANG"].includes(rank)) return "6";
  else if (["MVP+", "MVP"].includes(rank)) return "b";
  else if (["VIP+", "VIP"].includes(rank)) return "a";
  else return "7";
}

const ratio = (n1 = 0, n2 = 0) => (isFinite(n1 / n2) ? + (n1 / n2) : n1).toFixed(2)

const hexToHSL = hex => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    r = parseInt(result[1], 16);
    g = parseInt(result[2], 16);
    b = parseInt(result[3], 16);
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min) h = s = 0; // achromatic
    else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `hsl(${h*360}, ${s*100}%, ${l*100}%)`;
}

const findShadow = hsl => {
    var shadow = hsl.replace("hsl(", "").replace(")", "").replace(/%/g, "")
    shadow = shadow.split(",")

    shadow[2] = Number(shadow[2])*.25
    return shadow = `hsl(${shadow[0]}, ${shadow[1]}%, ${shadow[2]}%)`
}

const mcColor = (text, size=16, hd=false) => {
  var finalText = "";
  splitText = text.split("§").slice(1)

  splitText.forEach((parts, index) => {
    var color = "";

    if (parts[0] == "#" && parts[1] == "#") {
      const hex = `#${parts[2]}${parts[3]}${parts[4]}${parts[5]}${parts[6]}${parts[7]}`
      parts = parts.replace(`${hex}`, '');
      color = hexToHSL(hex)
    } else color = colors[parts[0]].hsl || "";
    
    var shadow = findShadow(color);
    if (hd) size += 1

    finalText += `<span style="color: ${color}; text-shadow: ${size/10}px ${size/10}px ${shadow};">${parts.split("").slice(1).join("")}</span>`
  })

  return finalText
}

const nwLevel = exp => exp ? Math.sqrt(Number(exp) * 2 + 30625) / 50 - 2.5: 1

module.exports = {
  getRank,
  getPlusColor,
  getRankColor,
  getFormattedRank,
  ratio,
  mcColor,
  nwLevel
}