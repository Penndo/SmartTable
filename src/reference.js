
function FindSimilarTextStyles(referenceStyle, styles, checkSameFont, checkSameWeight, checkSameSize, checkSameColor, checkSameParagraphSpacing, checkSameLineHeight, checkSameAlignment, checkSameCharacterSpacing) {

    var similarStyles = [];

    styles.forEach(function (style) {
        try {
        if (referenceStyle != style.textStyle) {

            var sameFont = false;
            try {
            sameFont = referenceStyle.style.fontFamily == style.textStyle.style.fontFamily;
            } catch (e) {
            clog("Finding similar text styles - Couldn't disclose font");
            }

            var sameWeight = false;
            try {
            sameWeight = referenceStyle.style.fontWeight == style.textStyle.style.fontWeight;
            } catch (e) {
            clog("Finding similar text styles - Couldn't disclose weight");
            }

            var sameSize = false;
            try {
            sameSize = referenceStyle.style.fontSize == style.textStyle.style.fontSize;
            } catch (e) {
            clog("Finding similar text styles - Couldn't disclose size");
            }

            var sameColor = false;
            try {
            sameColor = referenceStyle.style.textColor == style.textStyle.style.textColor;
            } catch (e) {
            clog("Finding similar text styles - Couldn't disclose color");
            }

            var sameParagraphSpacing = false;
            try {
            sameParagraphSpacing = referenceStyle.style.paragraphSpacing == style.textStyle.style.paragraphSpacing;
            } catch (e) {
            clog("Finding similar text styles - Couldn't disclose paragraph spacing");
            }

            var sameLineHeight = false;
            try {
            sameLineHeight = referenceStyle.style.lineHeight == style.textStyle.style.lineHeight;
            } catch (e) {
            clog("Finding similar text styles - Couldn't disclose line height");
            }

            var sameAlignment = false;
            try {
            sameAlignment = referenceStyle.style.alignment == style.textStyle.style.alignment;
            } catch (e) {
            clog("Finding similar text styles - Couldn't disclose alignment");
            }

            var sameCharacterSpacing = false;
            try {
            sameCharacterSpacing = referenceStyle.style.kerning == style.textStyle.style.kerning;
            } catch {
            clog("Finding similar text styles - Couldn't disclose character spacing");
            }

            var isSimilar = true;
            if (checkSameFont) isSimilar = isSimilar && sameFont;
            if (checkSameWeight) isSimilar = isSimilar && sameWeight;
            if (checkSameSize) isSimilar = isSimilar && sameSize;
            if (checkSameColor) isSimilar = isSimilar && sameColor;
            if (checkSameParagraphSpacing) isSimilar = isSimilar && sameParagraphSpacing;
            if (checkSameLineHeight) isSimilar = isSimilar && sameLineHeight;
            if (checkSameAlignment) isSimilar = isSimilar && sameAlignment;
            if (checkSameCharacterSpacing) isSimilar = isSimilar && sameCharacterSpacing;

            if (isSimilar) similarStyles.push(style);
        }
        }
        catch (e) {
        clog("There was an issue finding similar text styles");
        }



    });

    return similarStyles;
}