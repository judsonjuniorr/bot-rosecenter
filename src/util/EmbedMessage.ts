import Discord, { MessageEmbed } from 'discord.js';

interface Author {
  name: string | undefined;
  avatarURL?: string | undefined;
  url?: string | undefined;
}

interface Footer {
  text: string | undefined;
  imageURL?: string | undefined;
}

interface Info {
  color?: string | undefined;
  title?: string;
  url?: string | undefined;
  author?: Author;
  description?: string | undefined;
  thumbnailURL?: string | undefined;
  imageURL?: string | undefined;
  timestamp?: boolean | number;
  footer?: Footer;
}

// https://yagami.xyz/discord-embed-generator/
class EmbedMessage {
  public generateEmbed({
    color,
    title,
    url,
    author,
    description,
    thumbnailURL,
    imageURL,
    timestamp,
    footer,
  }: Info): MessageEmbed {
    const embed = new Discord.MessageEmbed();

    if (color) embed.setColor(color);
    if (title) {
      const titleLength = title.length;
      embed.setTitle(titleLength > 253 ? `${title.substr(0, 253)}...` : title);
    }
    if (url) embed.setURL(url);
    if (author) embed.setAuthor(author.name, author.avatarURL, author.url);
    if (description) {
      const descriptionLength = description.length;
      embed.setDescription(
        descriptionLength > 2045
          ? `${description.substr(0, 2045)}...`
          : description,
      );
    }
    if (thumbnailURL) embed.setThumbnail(thumbnailURL);
    if (imageURL) embed.setImage(imageURL);
    if (timestamp) embed.setTimestamp();
    if (footer) embed.setFooter(footer.text, footer.imageURL);

    return embed;
  }
}

export default EmbedMessage;
